"use client"

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import "@/globals.css";
import { ethers } from 'ethers';
import VotingContract from '../../build/contracts/Votacion.json';

ethers.utils.Logger.setLogLevel(ethers.utils.Logger.levels.DEBUG);

const contractAddress = '0xF41f3aB9639aAa5890119F9514CD1aEC7D846535';

const FILECOIN_TESTNET_CHAIN_ID = '0x4cb2f'; 

const CreateVote: React.FC = () => {

    /*const [candidatos, setCandidatos] = useState<{ nombre: string; votos: number }[]>([]);
    const [cuenta, setCuenta] = useState<string | null>(null);
    const [contrato, setContrato] = useState<ethers.Contract | null>(null);

    useEffect(() => {
        const conectarWallet = async () => {
            if (typeof window.ethereum !== 'undefined') {
                try {
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const signer = provider.getSigner();
                    const address = await signer.getAddress();
                    setCuenta(address);

                    const contratoInstance = new ethers.Contract(contractAddress, VotingContract, signer);
                    setContrato(contratoInstance);

                    console.log('Contrato inicializado:', contratoInstance.address);

                    // Escuchar todos los eventos del contrato
                    contratoInstance.on("*", (event) => {
                        console.log("Evento recibido:", event);
                    });

                    cargarCandidatos(contratoInstance);
                } catch (error) {
                    console.error('Error al conectar con la wallet:', error);
                }
            } else {
                console.log('Por favor, instala MetaMask!');
            }
        };

        conectarWallet();
    }, []);

    const cargarCandidatos = async (contratoInstance: ethers.Contract) => {
        try {
            console.log('Intentando obtener el número de candidatos...');
            const numCandidatos = await contratoInstance.candidatos.length();
            console.log('Número de candidatos:', numCandidatos.toString());

            const candidatos = [];
            for (let i = 0; i < numCandidatos.toNumber(); i++) {
                const candidato = await contratoInstance.candidatos(i);
                candidatos.push({ nombre: candidato.nombre, votos: candidato.votos.toNumber() });
            }
            console.log('Candidatos obtenidos:', candidatos);
            setCandidatos(candidatos);

            // Intenta llamar a obtenerResultados() con un límite de gas explícito
            console.log('Intentando obtener resultados con obtenerResultados()...');
            const resultados = await contratoInstance.obtenerResultados({ gasLimit: 300000 });
            console.log('Resultados obtenidos con obtenerResultados():', resultados);
        } catch (error) {
            console.error('Error al cargar candidatos:', error);
            if (error instanceof Error) {
                console.error('Mensaje de error:', error.message);
            }
        }
    };

    const votar = async (indiceCandidato: number) => {
        if (!contrato) return;
        try {
            const tx = await contrato.votar(indiceCandidato, { gasLimit: 200000 });
            console.log('Transacción de voto enviada:', tx.hash);
            await tx.wait();
            console.log('Transacción de voto confirmada');
            cargarCandidatos(contrato);
        } catch (error) {
            console.error('Error al votar:', error);
        }
    };*/

    const [candidatos, setCandidatos] = useState<{ nombre: string; votos: number }[]>([]);
    const [cuenta, setCuenta] = useState<string | null>(null);
    const [contrato, setContrato] = useState<ethers.Contract | null>(null);
    const [redCorrecta, setRedCorrecta] = useState(false);

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

    return (
        <div className="flex flex-col min-h-screen">
            {/* Navbar */}
            <Navbar />
            {/* Main content with minimum height */}
            <main className="flex-grow flex items-center justify-center rounded-md"
                style={{
                    backgroundImage: "url('https://mrwallpaper.com/images/hd/blockchain-computer-chip-design-fiz106o93z0vhzjb.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}>
                <div className='w-3/5 h-96 backdrop-blur-xl rounded-3xl drop-shadow-2xl p-7 shadow-lg shadow-black'>
                    <div className="container mx-auto p-4">
                        <h1 className="text-3xl font-bold mb-4 text-white text-center">Sistema de Votación en Filecoin Testnet</h1>
                        {!redCorrecta && (
                            <p className="text-red-500 mb-4">Por favor, cambia a la red de Filecoin Testnet</p>
                        )}
                        {cuenta ? (
                            <p className="mb-4 text-white text-center">Conectado: {cuenta}</p>
                        ) : (
                            <p className="mb-4 text-white text-center">Por favor, conecta tu wallet</p>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {candidatos.map((candidato, index) => (
                                <div key={index} className="bg-gray-800 p-4 rounded">
                                    <h2 className="grid text-xl text-white text-center font-semibold">{candidato.nombre}</h2>
                                    <p className='text-white text-center'>Votos: {candidato.votos}</p>
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
            </main>
            {/* Footer */}
            <Footer />
        </div>
    );
};

export default CreateVote;
