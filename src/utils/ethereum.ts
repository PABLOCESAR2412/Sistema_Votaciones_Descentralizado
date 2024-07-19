import { ethers } from 'ethers';

const CONTRACT_ADDRESS = '0xEF55CdEB8fb75F364Eb8301Ab1eDBA7C3fD3C50d';

const VotingTokenABI = 
[
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_candidato1",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_candidato2",
				"type": "string"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_candidatoIndex",
				"type": "uint256"
			}
		],
		"name": "votar",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "candidatos",
		"outputs": [
			{
				"internalType": "string",
				"name": "nombre",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "votos",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "haVotado",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "obtenerResultados",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "nombre",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "votos",
						"type": "uint256"
					}
				],
				"internalType": "struct Votacion.Candidato[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];// Reemplaza con la dirección de tu contrato desplegado

let provider: ethers.providers.Web3Provider;
let signer: ethers.providers.JsonRpcSigner;
let contract: ethers.Contract;

if (typeof window !== "undefined" && window.ethereum) {
  provider = new ethers.providers.Web3Provider(window.ethereum);
  signer = provider.getSigner();
  contract = new ethers.Contract(CONTRACT_ADDRESS, VotingTokenABI, signer);
}

export { contract };