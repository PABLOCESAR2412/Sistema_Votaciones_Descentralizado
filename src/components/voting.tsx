"use client"

//Esta directiva indica que este archivo es un componente React que se ejecutará en el cliente (navegador) en vez de en el servidor.

import React, { useState, useEffect } from 'react';
import "@/globals.css";
import { ethers } from 'ethers';
import VotingContract from '../../build/contracts/Votacion.json';

/*Importa las dependencias necesarias para el componente: React, los hooks useState y useEffect, los estilos globales, 
la librería ethers para interactuar con la blockchain y el archivo ABI del contrato de votación.*/

ethers.utils.Logger.setLogLevel(ethers.utils.Logger.levels.DEBUG);

//Configura el nivel de log de ethers a DEBUG para obtener información detallada sobre las operaciones que se realicen.

const contractAddress = '0xF41f3aB9639aAa5890119F9514CD1aEC7D846535';

//Define la dirección del contrato desplegado en la red blockchain.

const FILECOIN_TESTNET_CHAIN_ID = '0x4cb2f';

//Define el ID de la cadena para la red de prueba de Filecoin.

const Voting: React.FC = () => {

    const [candidatos, setCandidatos] = useState<{ nombre: string; votos: number }[]>([]);
    const [cuenta, setCuenta] = useState<string | null>(null);
    const [contrato, setContrato] = useState<ethers.Contract | null>(null);
    const [redCorrecta, setRedCorrecta] = useState(false);

    //Define el componente Voting como un Functional Component (React.FC). Usa hooks de estado para manejar los 
    //candidatos, la cuenta del usuario, la instancia del contrato y el estado de la red correcta.

    useEffect(() => {
        const conectarWallet = async () => {
            if (typeof window.ethereum !== 'undefined') {
                try {
                    // Primero, verifica si estamos en la red correcta
                    await verificarYCambiarRed();

                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const signer = provider.getSigner();
                    const address = await signer.getAddress();
                    setCuenta(address);

                    const contratoInstance = new ethers.Contract(contractAddress, VotingContract, signer);
                    setContrato(contratoInstance);

                    console.log('Contrato inicializado:', contratoInstance.address);

                    await cargarCandidatos(contratoInstance);
                } catch (error) {
                    console.error('Error al conectar con la wallet:', error);
                }
            } else {
                console.log('Por favor, instala MetaMask!');
            }
        };

        conectarWallet();
    }, []);

    /*El hook useEffect se ejecuta cuando el componente se monta. Intenta conectar con la wallet del usuario usando window.ethereum (MetaMask), 
    cambiar a la red correcta y cargar los candidatos del contrato. Si window.ethereum no está disponible, indica que MetaMask no está instalado.*/

    const verificarYCambiarRed = async () => {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId !== FILECOIN_TESTNET_CHAIN_ID) {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: FILECOIN_TESTNET_CHAIN_ID }],
                });
                setRedCorrecta(true);
            } catch (switchError: any) {
                // Este error código indica que la cadena no ha sido agregada a MetaMask.
                if (switchError.code === 4902) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [{
                                chainId: FILECOIN_TESTNET_CHAIN_ID,
                                chainName: 'Filecoin Testnet',
                                nativeCurrency: {
                                    name: 'Filecoin',
                                    symbol: 'tFIL',
                                    decimals: 18
                                },
                                rpcUrls: ['https://rpc.ankr.com/filecoin_testnet'],
                                blockExplorerUrls: ['https://hyperspace.filfox.info/en']
                            }],
                        });
                        setRedCorrecta(true);
                    } catch (addError) {
                        console.error('Error al añadir la red:', addError);
                    }
                }
                console.error('Error al cambiar de red:', switchError);
            }
        } else {
            setRedCorrecta(true);
        }
    };

    /*Esta función verifica si la red actual es la de prueba de Filecoin y, si no lo es, intenta cambiar a ella. 
    Si la red no está configurada en MetaMask, intenta añadirla.*/

    const cargarCandidatos = async (contratoInstance: ethers.Contract) => {
        try {
            console.log('Intentando obtener resultados...');
            const resultados = await contratoInstance.obtenerResultados();
            console.log('Resultados obtenidos:', resultados);

            const candidatosFormateados = resultados.map((candidato: any) => ({
                nombre: candidato.nombre,
                votos: candidato.votos.toNumber()
            }));

            console.log('Candidatos formateados:', candidatosFormateados);
            setCandidatos(candidatosFormateados);
        } catch (error) {
            console.error('Error al obtener resultados:', error);

            // Si falla obtenerResultados, intentamos obtener los candidatos uno por uno
            try {
                console.log('Intentando obtener candidatos individualmente...');
                const candidatosIndividuales = [];
                let i = 0;
                while (true) {
                    try {
                        const candidato = await contratoInstance.candidatos(i);
                        candidatosIndividuales.push({
                            nombre: candidato.nombre,
                            votos: candidato.votos.toNumber()
                        });
                        i++;
                    } catch (e) {
                        // Asumimos que hemos llegado al final del array cuando ocurre un error
                        break;
                    }
                }
                console.log('Candidatos obtenidos individualmente:', candidatosIndividuales);
                setCandidatos(candidatosIndividuales);
            } catch (error) {
                console.error('Error al obtener candidatos individualmente:', error);
            }
        }
    };

    /*Esta función intenta cargar los resultados de los candidatos desde el contrato inteligente. Si falla, 
    intenta obtener los candidatos uno por uno.*/

    const votar = async (indiceCandidato: number) => {
        if (!contrato || !redCorrecta) return;
        try {
            const tx = await contrato.votar(indiceCandidato);
            console.log('Transacción de voto enviada:', tx.hash);
            await tx.wait();
            console.log('Transacción de voto confirmada');
            await cargarCandidatos(contrato);
        } catch (error) {
            console.error('Error al votar:', error);
        }
    };

    /*Esta función envía una transacción para votar por un candidato y actualiza la lista de candidatos una vez que la transacción se confirma.*/

    return (
        <div className="x-full flex flex-col">
            <div className='w-11/12 my-16 mx-20 h-full backdrop-blur-xl rounded-3xl drop-shadow-2xl p-7 shadow-lg shadow-black'>
                <div className="container mx-auto p-4">
                    <h1 className="text-3xl font-bold mb-4 text-white text-center">Sistema de Votación en Filecoin Testnet</h1>
                    {!redCorrecta && (
                        <p className="text-red-500 mb-4">Por favor, cambia a la red de Filecoin Testnet</p>
                    )}
                    {cuenta ? (
                        <p className="text-black text-center text-xl bg-white w-1/2 ml-72 p-3 rounded-3xl mt-8 mb-8">Conectado: {cuenta}</p>
                    ) : (
                        <p className="mb-4 text-black text-center">Por favor, conecta tu wallet</p>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {candidatos.map((candidato, index) => (
                            <div key={index} className="bg-white p-4 rounded">
                                <h2 className="grid text-2xl text-black text-center font-semibold">{candidato.nombre}</h2>
                                <p className='text-black text-center text-xl'>Votos: {candidato.votos}</p>
                                <div className='flex justify-center'>
                                    <button
                                        onClick={() => votar(index)}
                                        disabled={!redCorrecta}
                                        className={`mt-2 bg-blue-500 hover:bg-blue-700 justify-items-center items-center place-items-center text-white font-bold py-2 px-4 rounded ${!redCorrecta && 'opacity-50 cursor-not-allowed'}`}
                                    >
                                        Votar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    /*Esta parte del código devuelve el componente de la interfaz de usuario. Si la red no es correcta, muestra un mensaje. 
    Si la cuenta está conectada, muestra la dirección. Renderiza una lista de candidatos con sus nombres y votos, y un botón para votar.*/
};

export default Voting;
