const Voting = artifacts.require("Voting");
const assert = require("assert");

contract("Voting", function(accounts) {
    let votingInstance;

    // Antes de cada prueba, desplegar el contrato Voting
    before(async function() {
        votingInstance = await Voting.deployed();
    });

    // Ejemplo de prueba: verificar que se puedan agregar candidatos correctamente
    it("should add candidates correctly", async function() {
        await votingInstance.addCandidate("Alice");
        await votingInstance.addCandidate("Bob");

        // Verificar que hay exactamente dos candidatos
        let candidatesCount = await votingInstance.candidatesCount();
        assert.equal(candidatesCount, 2, "Incorrect number of candidates added");
    });

    // Ejemplo de prueba: verificar que se pueda emitir un voto correctamente
    it("should allow voting", async function() {
        // Hacer que accounts[0] vote por el candidato 1
        await votingInstance.vote(1, { from: accounts[0] });

        // Verificar que el voto se haya registrado correctamente
        let votes = await votingInstance.getVotes(1);
        assert.equal(votes, 1, "Vote count not updated correctly");
    });

    // Ejemplo de prueba: verificar que se pueda determinar el candidato ganador correctamente
    it("should determine the correct winner", async function() {
        // Hacer que algunos votantes emitan votos
        await votingInstance.vote(1, { from: accounts[1] });
        await votingInstance.vote(2, { from: accounts[2] });
        await votingInstance.vote(1, { from: accounts[3] });

        // Obtener el candidato ganador
        let winnerId = await votingInstance.getWinner();
        assert.equal(winnerId, 1, "Incorrect winner determined");
    });
});
