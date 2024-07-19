// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
/*La primera línea especifica la licencia del contrato (MIT en este caso). La segunda línea especifica la versión del compilador de Solidity que debe usarse (0.8.0 o superior).*/

contract Votacion {
    struct Candidato {
        string nombre;
        uint256 votos;
    }

    //Define el contrato Votacion y una estructura Candidato que tiene dos campos: nombre (nombre del candidato) y votos (cantidad de votos que ha recibido).

    Candidato[] public candidatos;
    mapping(address => bool) public haVotado;
    address public owner;

    ///Define tres variables de estado:

    //candidatos: un array público de estructuras Candidato.
    //haVotado: un mapping que almacena si una dirección ha votado.
    //owner: la dirección del propietario del contrato.

    modifier onlyOwner() {
        require(msg.sender == owner, "Solo el propietario puede realizar esta accion");
        _;
    }

    //Define un modificador onlyOwner que restringe el acceso a ciertas funciones solo al propietario del contrato.

    constructor(string memory nombreCandidato1, string memory nombreCandidato2) {
        owner = msg.sender;

        require(bytes(nombreCandidato1).length > 0, "El nombre del primer candidato no puede estar vacio");
        require(bytes(nombreCandidato2).length > 0, "El nombre del segundo candidato no puede estar vacio");

        candidatos.push(Candidato(nombreCandidato1, 0));
        candidatos.push(Candidato(nombreCandidato2, 0));
    }

    //Define el constructor del contrato que toma dos nombres de candidatos como parámetros. Asigna la dirección del propietario y agrega los dos candidatos al array candidatos. 
    //También verifica que los nombres de los candidatos no estén vacíos.

    function votar(uint256 indiceCandidato) public {
        require(indiceCandidato < candidatos.length, "Indice de candidato invalido");
        require(!haVotado[msg.sender], "Ya has votado");

        candidatos[indiceCandidato].votos++;
        haVotado[msg.sender] = true;
    }

    //Define la función votar que toma el índice de un candidato como parámetro. Verifica que el índice sea válido y que la dirección del votante no haya votado antes. 
    //Luego incrementa el número de votos del candidato y marca al votante como que ha votado.

    function obtenerResultados() public view returns (Candidato[] memory) {
        return candidatos;
    }

    //Define la función obtenerResultados que devuelve el array candidatos. Esta función es de solo lectura (view).

    function agregarCandidato(string memory nombreNuevoCandidato) public onlyOwner {
        require(bytes(nombreNuevoCandidato).length > 0, "El nombre del nuevo candidato no puede estar vacio");

        candidatos.push(Candidato(nombreNuevoCandidato, 0));
    }

    //Define la función agregarCandidato que permite al propietario del contrato agregar un nuevo candidato. 
    //Verifica que el nombre del nuevo candidato no esté vacío antes de agregarlo al array candidatos.
}
