// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol"; //Importación de librería desde OpenZeppelin (brinda el
//comportamiento y funcuonalidades del estandar ERC-721 de forma gratuita)

contract TicketBlock is ERC721 {
    //Funcion para desplegar el contrato inteligente en la Blockchain
    address public owner;
    uint256 public totalEventos;
    uint256 public totalSupply;

    struct Evento {
        uint256 id;
        string name;
        uint256 cost;
        uint256 tickets;
        uint256 maxTickets;
        string date;
        string time;
        string location;
    }

    mapping(uint256 => Evento) eventos;
    mapping(uint256 => mapping(address => bool)) public hasBought;
    mapping(uint256 => mapping(uint256 => address)) public seatTaken;
    mapping(uint256 => uint256[]) seatsTaken;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        owner = msg.sender;
    }

    function list(
        string memory _name,
        uint256 _cost,
        uint256 _maxTickets,
        string memory _date,
        string memory _time,
        string memory _location
    ) public onlyOwner {
        totalEventos++;
        eventos[totalEventos] = Evento(
            totalEventos,
            _name,
            _cost,
            _maxTickets,
            _maxTickets,
            _date,
            _time,
            _location
        );
    }

    function mint(uint256 _id, uint256 _seat) public payable {
        require(_id != 0);
        require(_id <= totalEventos);

        require(msg.value >= eventos[_id].cost);

        require(seatTaken[_id][_seat] == address(0));
        require(_seat <= eventos[_id].maxTickets);

        eventos[_id].tickets -= 1;

        hasBought[_id][msg.sender] = true;

        seatTaken[_id][_seat] = msg.sender;

        seatsTaken[_id].push(_seat);

        totalSupply++;
        _safeMint(msg.sender, totalSupply);
    }

    function getEvento(uint256 _id) public view returns (Evento memory) {
        return eventos[_id];
    }

    function getSeatsTaken(uint256 _id) public view returns (uint256[] memory) {
        return seatsTaken[_id];
    }

    function withdraw() public onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }
}
