// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TokenTix is ERC721 {

// variables 
   address public owner;
   uint256 public moviesCount;
   uint256 public totalSupply; 

// Movie
   struct Movie{
    uint256 id;
    string name;
    uint256 cost;
    uint256 tickets; //no of tickets avail to buy
    uint256 maxTickets; //ticket per account
    string date;
    string time;
    string loaction;
   }

// storing all the movies into the blockchain 
   mapping(uint256 => Movie) movies;
// seats for the movies (id of movie -> seat no -> add of seat owner)
   mapping(uint256 => mapping(uint256 => address)) public seatTrx; 
// already bought seats
   mapping(uint256 => uint256[]) seatsBought;
// users who had already bought
   mapping(uint256 => mapping(address => bool)) public hasBought;

   constructor(
    string memory _name, 
    string memory _symbol
    ) ERC721(_name, _symbol) {
        owner = msg.sender;
   }

//modifiers
    modifier onlyOwner {
        require(msg.sender == owner);
        _; //execute before the code
    }

// initiating  a movie 
   function list(
    string memory _name,
    uint256 _cost,
    uint256 _maxTickets,
    string memory _date,
    string memory _time,
    string memory _loaction
    ) public onlyOwner {
        moviesCount ++;
        movies[moviesCount] = Movie(moviesCount ,_name, _cost, _maxTickets, _maxTickets, _date, _time, _loaction);
   }

// minting NFT for each movie and seat
   function mint(uint256 _id, uint256 _seat ) public payable {
    require(_id != 0);
    require( msg.value >= movies[_id].cost);



    //reducing the number of tickets
    movies[_id].tickets -= 1;

    hasBought[_id][msg.sender] = true;

    //asssigning the seats
    seatTrx[_id][_seat] = msg.sender;
    seatsBought[_id].push(_seat);

    totalSupply ++;
    _safeMint(msg.sender , totalSupply);
   }

// Getter functions
   function getMovie(uint256 _id) public view returns(Movie memory){
    return movies[_id];
   }

   function getSeatsTaken(uint256 _id) public view returns (uint256[] memory) {
        return seatsBought[_id];
    }

    function withdraw() public onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }
}
     