pragma solidity ^0.4.24;
// We have to specify what version of compiler this code will compile with
contract SeaFoodContract {
  
  struct Entity {
    address _address;
    bytes32 _id;
    string _name;
    uint _value;//per quantity
    uint _quantity; 
    bool _isAlive;
    uint _index;
    bytes32 _stateId ;
  }

  struct User {
    address _account;
    string _username;
    string _type; //Type
    uint _balance;
    bool _isAlive;
  }
    
  //map all entities of a address
  mapping (address => Entity[]) private userEntities;
  //map an entity with its unique entity id
  mapping (bytes32 => Entity) private entities;
  //map each address with its user
  mapping (address => User)  private userStructs;
  //map history of users with entity
  mapping (bytes32=>address[]) public entityUsers; 
  
  string[] public owners;
  address public owner;
  address[] public userIds;
  event LogNewEntity   (address indexed _userAddress,bytes32 _id, string _name, uint _value,uint _quantity);
  event LogUpdateEntity   (address indexed _userAddress,bytes32 _id, string _name, uint _value,uint _quantity);
  event LogNewUser   (address indexed _userAddress, string _username , string _type, uint _balance);
  event Transaction(address _from, address _to, bytes32 _senderEntityid ,bytes32 _buyerEntityid ,uint _quantity, uint _amount);

  /* This is the constructor which will be called once when you
  deploy the contract to the blockchain. When we deploy the contract,
  */
   constructor() public 
  {
    owner = msg.sender;
    owners = ["Admin","Fisherman","Buyer","Restauranteur"];
    userStructs[msg.sender]._username   = 'Admin';
    userStructs[msg.sender]._type   = owners[0];
    userStructs[msg.sender]._balance = 0 ; 
    userStructs[msg.sender]._isAlive = true ; 
    userIds.push(msg.sender);
  }

  function addAsFisherMan(address _address,string _name) public
  {
    insertUser(_address,_name,owners[1]);
  }

  function addAsBuyer(address _address,string _name) public 
  {
   insertUser(_address,_name,owners[2]);
  }

  function addAsRestaurantOwner(address _address,string _name) public
  {
    insertUser(_address,_name,owners[3]);
  }
  

  function insertUser(
    address _userAddress, 
    string _username,
    string _type) 
    internal
    returns(bool success)
  {
    require(!userStructs[_userAddress]._isAlive);
    userStructs[_userAddress]._account = _userAddress;
    userStructs[_userAddress]._username   = _username;
    userStructs[_userAddress]._type   = _type;
    userStructs[_userAddress]._balance = 1000 ; 
    userStructs[_userAddress]._isAlive = true ; 
    userIds.push(_userAddress);
    emit LogNewUser(
        _userAddress, 
        _username, 
        _type,
        userStructs[_userAddress]._balance);
    return true;
  }
  
  function getUserAddressByIndex(uint _index)
  public 
  constant returns (address)
  {
      require(_index >= 0 && _index<userIds.length);
      require(userStructs[userIds[_index]]._isAlive);
      return userIds[_index];
  }
  
  function getUsersAddressCount()
  public 
  constant
  returns (uint){
      return userIds.length;
  }

    function getUser(address _userAddress)
    public 
    constant
    returns(string _username , string _type, uint _balance )
  {
      require(userStructs[_userAddress]._isAlive);
    return(
      userStructs[_userAddress]._username, 
      userStructs[_userAddress]._type,
      userStructs[_userAddress]._balance);
  } 
  
  function updateUsername(address _userAddress , string _username)
    public 
    returns(bool _success )
  {
      require(userStructs[_userAddress]._isAlive) ;
      userStructs[_userAddress]._username   = _username;
      return true;
  }
  
  function addEntity(address _address,
    string _name,
    uint _value,
    uint _quantity) public 
    returns(bytes32) 
  {
         Entity[] memory _entities = userEntities[_address];
         require(userStructs[_address]._isAlive);
        //  require(msg.sender == _address);
         uint _index = _entities.length;
         for(uint i=0;i<_index;i++){
             require(!compareStrings(_entities[i]._name,_name));
         }
         //Create entity id
         bytes32 _entityId = createId(_address,_name,userStructs[_address]._username);
         Entity memory _entity = Entity(_address,_entityId,_name,_value,_quantity,true,_index,0);
         userEntities[_address].push(_entity);
         entities[_entityId] = _entity;
         entityUsers[_entityId].push(_address);
   emit LogNewEntity(
        _address,_entityId, 
        _name, 
        _value,
        _quantity);
         return _entityId;
  }

  function getEntityCount(address _address)
    public 
    constant
    returns(uint _count)
  {
      require(userStructs[_address]._isAlive);
      return userEntities[_address].length;
  }
  
  
  function getEntityById(bytes32 _id)
  public constant
  returns (address,
    string ,
    uint ,
    uint ,string,uint,bytes32)
  {
        Entity memory _entity = entities[_id];
        string storage _username = userStructs[entities[_id]._address]._username;
        require(_entity._isAlive);
        return ( _entity._address,_entity._name,_entity._value,_entity._quantity,_username,_entity._index,_entity._stateId);
  }
  
  function getEntityByAddress(address _address , uint _index)
  public constant
  returns (bytes32,
    string ,
    uint ,
    uint ,string,uint,bytes32 )
  {
        Entity[] memory _entities = userEntities[_address];
        require(_entities.length > _index && _index >= 0) ;
        require(_entities[_index]._isAlive) ;
        return (_entities[_index]._id,_entities[_index]._name,_entities[_index]._value,_entities[_index]._quantity,userStructs[_entities[_index]._address]._username,_entities[_index]._index,_entities[_index]._stateId);
  }

  function updateEntity(address _address,
    string _name,
    uint _value,
    uint _quantity,uint _index,bytes32 _stateId) 
    public
    returns(bool _success) 
  {
    //   require(msg.sender == _address);
    Entity[] memory _entities = userEntities[_address];
    require(_entities.length > _index && _index >= 0) ;
    require(_entities[_index]._isAlive) ;
    // userEntities[_address][_index]._address = _address;
    // userEntities[_address][_index]._id = _id;
    userEntities[_address][_index]._name = _name;
    userEntities[_address][_index]._value = _value;
    userEntities[_address][_index]._quantity = _quantity;
    userEntities[_address][_index]._stateId = _stateId;
    entities[userEntities[_address][_index]._id] = userEntities[_address][_index];
   emit  LogUpdateEntity(_address,_entities[_index]._id, _entities[_index]._name, _entities[_index]._value,_entities[_index]._quantity);
    return true;
  }
  
  function getEntityUserAddressess(bytes32 _entityId,uint _index) public returns (address) {
      require(_index >= 0);
      return entityUsers[_entityId][_index];
  }
  
  function getEntityUserAddressessCount(bytes32 _entityId) public returns (uint) {
     
      return entityUsers[_entityId].length;
  }

  function deleteEntity(bytes32 _entityId) private  returns (bool){
    //   checkOwner();//check
      require( entities[_entityId]._isAlive);
      userEntities[entities[_entityId]._address][ entities[_entityId]._index]._isAlive =  false;
      entities[_entityId]._isAlive = false;
    //   delete  entities[_entityId];
    //   delete userEntities[ entities[_entityId]._address][ entities[_entityId]._index];
      return true;
  }

  function buyEntity(address _sender,address _buyer,string _name,bytes32 _entityId,uint _quantity,uint _amount,uint _index) public returns (bool)
  {
        // checkOwner();
        // require(msg.sender == _buyer);
        Entity[] memory _sender_entities = userEntities[_sender];
        require(userStructs[_sender]._isAlive && userStructs[_buyer]._isAlive) ;//user not living / dead
        require(_sender_entities[_index]._isAlive);
        require(_sender_entities.length > _index && _index >= 0);
        
        require(_sender_entities[_index]._quantity >= _quantity) ;//insufficient quantity
        require(userStructs[_buyer]._balance >= (_quantity * _amount)) ;//low balances
        
        uint orig_qty = userEntities[_sender][_index]._quantity;
        uint left_qty = orig_qty - _quantity;
          //update balance
        updateBalance(_sender,_buyer,_quantity,_amount);
        bytes32 _buyerEntityId = addEntity(_buyer,_name,_amount,_quantity);
        if(left_qty == 0) { 
            //all quantity transferred
        //  userEntities[_sender][_index]._isAlive=false;
         deleteEntity(_entityId);
        }
        else {
         updateEntity(_sender,_name,_amount,left_qty,_index,0); 
        }
      emit Transaction (_sender, _buyer,_entityId , _buyerEntityId , _quantity,  _amount);

      return true;
  }
  
   function updateEntityStateId(bytes32 _entityId1,bytes32 _entityId2,bytes32 _stateId) public returns(bool){
        require(entities[_entityId1]._isAlive || entities[_entityId2]._isAlive);
        entities[_entityId1]._stateId = _stateId;
         entities[_entityId2]._stateId = _stateId;
        userEntities[entities[_entityId1]._address][entities[_entityId1]._index]._stateId = _stateId;
        userEntities[entities[_entityId2]._address][entities[_entityId2]._index]._stateId = _stateId;
        return true;
    }
  
  function updateBalance(address _sender,address _buyer,uint _quantity,uint _amount) internal
  {
        userStructs[_buyer]._balance = userStructs[_buyer]._balance - (_quantity * _amount);
        userStructs[_sender]._balance = userStructs[_sender]._balance + (_quantity * _amount);
  }
  
  function checkOwner() internal view 
  {
           require(owner == msg.sender);
  }

  function compareStrings (string a, string b) internal pure returns (bool)
  {
       return (keccak256(a)) == (keccak256(b));
  }
    
  //generate specific entity id with address and name 
  function createId(address _address,string _name,string _username) public pure returns (bytes32 blobId) {
        // Generate the blobId.
        blobId = bytes32(keccak256(_address,_name,_username));
  }
}
