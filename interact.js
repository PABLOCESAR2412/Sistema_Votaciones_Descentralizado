const Voting = artifacts.require("Voting");

module.exports = async function(callback) {
  try {
    let instance = await Voting.deployed();

    // Obtener y mostrar los detalles de los candidatos
    for (let candidateId = 1; candidateId <= 2; candidateId++) {
      let candidate = await instance.getCandidate(candidateId);
      console.log(`ID: ${candidate.id}, Name: ${candidate.name}, Votes: ${candidate.voteCount}`);
    }

    // Obtener y mostrar el ganador
    let winnerId = await instance.getWinner();
    let winner = await instance.getCandidate(winnerId);
    console.log(`Winner: ${winner.name} with ${winner.voteCount} votes.`);

    callback();
  } catch (error) {
    console.error("Error:", error);
    callback(error);
  }
};
