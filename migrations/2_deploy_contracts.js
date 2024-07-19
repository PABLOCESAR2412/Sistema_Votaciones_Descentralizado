/*const Votacion = artifacts.require("Votacion");

module.exports = function (deployer) {
  const candidato1 = "Alice";
  const candidato2 = "Bob";
  deployer.deploy(Votacion, candidato1, candidato2);
};*/

const Votacion = artifacts.require("Votacion");

module.exports = function (deployer) {
  const candidato1 = "Candidato 1"; // Change as needed
  const candidato2 = "Candidato 2"; // Change as needed
  deployer.deploy(Votacion, candidato1, candidato2, { gas: 6000000 });
};