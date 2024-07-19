// src/ethersConfig.js
import { ethers } from "ethers";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

// Dirección del contrato desplegado
const contractAddress =  "0x011f07Af3ace71487b55DCEf50530743e9C7B285";

// ABI del contrato (definición de la interfaz del contrato)
const contractABI = [
  // Copia la ABI de tu contrato aquí
];

const contract = new ethers.Contract(contractAddress, contractABI, signer);

export { provider, signer, contract };
