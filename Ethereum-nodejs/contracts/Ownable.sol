pragma solidity ^0.4.24;

import "./Roles.sol";

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
  using Roles for Roles.Role;
  address public owner;
  
  Roles.Role private allowed ;

  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
//   event AllowanceGranted(address indexed admin, address indexed newOwner,uint256 updated);
  event MemberAdded(address indexed account);
  event MemberRemoved(address indexed account);

  constructor() public {
    owner = msg.sender;
    allowed.add(msg.sender);
  }

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }
  
  modifier onlyMembers(address _address) {
      require(memberAllowed(_address) && memberAllowed(msg.sender));
      _;
  }

  function transferOwnership(address newOwner) public onlyOwner {
    require(newOwner != address(0));
    owner = newOwner;
    emit OwnershipTransferred(owner, newOwner);
  }
  
  // TODO : check members already added
  //only by owner
  function addMember(address _address) public onlyOwner {
    //   require(!allowed.has(_address) ,'Member already exist');
      allowed.add(_address);
      emit MemberAdded(_address);
  }
  
  //only by owner
  function removeMember(address _address) public onlyOwner  {
       allowed.remove(_address);
       emit MemberRemoved(_address);
       
  }
  
  function memberAllowed(address _address) public view returns(bool) {
      return allowed.has(_address);
  }
  
  function ownerAllowed(address _address) public view onlyMembers(_address) returns(bool) {
      return (_address == owner);
  }
  
  //kill the contract and returns funds to owner address
  function kill() onlyOwner() public {
        selfdestruct(owner);
    }

}
