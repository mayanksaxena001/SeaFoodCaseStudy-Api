pragma solidity ^0.4.24;


import "./FCTToken.sol";
import "./Enums.sol";

contract AccessControl is FCTToken {
    using Enums for Enums.Enum;
    Enums.Enum internal enums;
    
      // structures 
      struct User {
          address _address;
          string _username;
          uint _type; //Type
          uint256 _balance;//StandardToken balance
          bool _isAlive;
          uint256 _updatedAt;
          uint256 _createdAt;
          //TODO : added by a member
     }
     //TODO functionality for updating user
     
     //mapping and variables
      address[] public users;
      mapping (address => User) internal userIdMap;
      
      //events
      event LogNewUserEvent  (address indexed _userAddress, string _username , string _type, uint _balance,uint256 _createdAt);
    //   event Transaction(address _from, address _to, bytes32 _assetIdFrom ,bytes32 _assetIdTo ,uint _quantity, uint _amount,uint256 _updatedAt);
     
      constructor(string _name) public {
           enums.addToEnumMapping();
           enums.createEnumMapping();
           User memory user = User(msg.sender,_name,Enums.getAdminOwnerType(),balanceOf(msg.sender),true,now,now);
           storeUser(msg.sender,user);
       }
      
      //modifiers
      modifier isExisting(address _address) {
          require(memberAllowed(_address), "User does not exist");
          _;
      }

      modifier isSupplier(address _address) {
          require(memberAllowed(_address), "User does not exist");
          require(userIdMap[_address]._type == Enums.getSupplierOwnerType(), "Only suppliers are allowed to add");
          _;
      }
      
      modifier allowUpdateAsset(address _address) {
          require(userIdMap[_address]._type == Enums.getProducerOwnerType(),"Updating Asset not allowed for your role");
          _;
      }

      function addProducer(address _address,string _name) external {
          createNewUser(_address,_name,Enums.getProducerOwnerType());
      }

      function addConsumer(address _address,string _name) external {
          createNewUser(_address,_name,Enums.getConsumerOwnerType());
      }

      function addSupplier(address _address,string _name) external {
          createNewUser(_address,_name,Enums.getSupplierOwnerType());
      }
      
      function createNewUser(address _address,string _name,uint _type) internal {
           transfer(_address,1000);//give 1000 tokens on signup
           addMember(_address);
           User memory user = User(_address,_name,_type,balanceOf(_address),true,now,now);
           storeUser(_address,user);
      }
      
      function storeUser(address _address, User _user) internal {
           require(!userIdMap[_address]._isAlive,"User already exist");
           users.push(_address);
           userIdMap[_address] = _user;
           emit LogNewUserEvent(_address,_user._username,enums.getStringOwnerType(_user._type),_user._balance,now);
      }
      
      function getUserByAddress(address _address) external view isExisting(_address) returns(string,string,uint256)
      {
          User memory user = userIdMap[_address];
          user._balance = balanceOf(_address);
          return (user._username,enums.getStringOwnerType(user._type),user._balance);
      }
      
      function getUsers()
        public 
        view 
        returns(address[])
        {
      return users;
        }
     
     function requestTokens(address _address,uint256 _value) public isExisting(_address)  {
         transfer(_address,_value);
     }
    
}