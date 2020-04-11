pragma solidity ^0.4.24;

import "./AccessControl.sol";

contract AssetOwnership is AccessControl{

    struct Asset {
        bytes32 _id;
        address _address;//current owner
        string _name;
        uint _value;//per quantity
        uint _quantity; 
        bytes32 _trackId;//
        // bool _isAlive;//TODO no need for checking it
        uint256 _createdAt;
        uint256 _updatedAt;
    }
      
    struct Transaction {
        bytes32 _id;// unique id
        address _from;// seller
        address _to;// buyer
        address _supplier;
        uint _status;// current status

        bytes32 _assetId;

        bytes32 _sensorId;//
        uint _amount;
        uint256 _createdAt;
        uint256 _updatedAt;
    }
  
    //events
   
    event LogNewAssetEvent (address indexed _address,bytes32 _id, string _name, uint _value,uint _quantity,uint256 _createdAt);
    event LogUpdateAssetEvent (address indexed _userAddress,bytes32 _id, string _name, uint _value,uint _quantity,uint256 _updatedAt);
    // event LogDeleteAssetEvent (address indexed _userAddress,string _username, string _name, uint256 _deletedAt);
    event LogTransferAssetEvent (address indexed _to,address indexed _from,bytes32 _id, string _name, uint _value,uint _quantity,uint256 _timestamp);
   
    event LogSupplierSensorAlert (address _supplier , bytes32 _transactionId ,string _status ,uint256 _timestamp);
    event LogTransactionUpdateEvent  (bytes32 _transactionId , string _status , uint256 _timestamp); 
    // map asset id with address
    mapping (address => mapping(bytes32=>bool)) internal userAssetIds;
    // map an asset with its unique asset id
    mapping (bytes32 => Asset) internal assets;
    mapping (bytes32 => address[]) internal assetOwners;//TODO: Do we need this?
    mapping (address => bytes32[]) internal userAssets;
  
    mapping (address => bytes32[]) internal userTransactions;// tranfers done by user
    mapping (bytes32 => Transaction) internal transactions;// each transactions
  
  constructor(string _name) AccessControl(_name) public {
      
  }
  
  modifier ownerOf(address _address,bytes32 _id)  {
      require(_address != address(0),"Address is zero");
      //double check
      require(userAssetIds[_address][_id],"This asset is not with the specified address");
      require(assets[_id]._address == _address,"You are not authorized");
      _;
  }
  
  modifier NotEmpty(bytes32 id) {
      require(!equals(id,'') && id !=0,"Id should not be empty");
      _;
  }
  
  modifier isTransactionPending(bytes32 _id) {
      require(transactions[_id]._status == Enums.getPendingStatus());
      _;
  }
  
  function addAssetToMap(Asset memory asset) internal {
      //adding asset to each map
      userAssetIds[asset._address][asset._id] =true;
      assets[asset._id] = asset;
      assetOwners[asset._id].push(asset._address);
      userAssets[asset._address].push(asset._id);
  }

   function createAsset(address _address,string _name,uint _value,uint _quantity) external allowUpdateAsset(_address) isExisting(_address) {
      bytes32 _id = createId(_address,_name,userIdMap[_address]._username,now);
      Asset memory asset = Asset(_id,_address,_name,_value,_quantity,0,now,now);
      addAssetToMap(asset);
      emit LogNewAssetEvent(asset._address,asset._id,asset._name,asset._value,asset._quantity,now);
  }

  function editAsset(address _address,bytes32 _id,uint _value,uint _quantity) external allowUpdateAsset(_address) isExisting(_address){
    Asset storage asset = assets[_id];
    updateAsset(_address,_id,_value,_quantity,asset._trackId);
  }
  
  //TODO check for updation by producer only
  //DONE : changes should be made for every mapped asset
  function updateAsset(address _address,bytes32 _id,uint _value,uint _quantity,bytes32 _trackId) internal  isExisting(_address) {
      Asset storage asset = assets[_id];
      asset._value = _value;
      asset._quantity = _quantity;
      asset._address = _address;
      asset._trackId = _trackId;
      emit LogUpdateAssetEvent(_address,asset._id,asset._name,asset._value,asset._quantity,now);
  }

   //DONE: check for index
  function getAssetOwners(bytes32 _assetId) view public NotEmpty(_assetId)
   returns 
    (address[]) 
    {
       return assetOwners[_assetId];
    }
  
  //DONE: check for index
  function getAssetIdsByAddress(address _address) view public isExisting(_address)
   returns 
    (bytes32[]) 
    {
       return userAssets[_address];
    }

  //DONE: get out more details
  function getAssetById(bytes32 _id) public view NotEmpty(_id) 
    //   checkAsset(_id) , TODO
  returns 
    (address,
    bytes32 ,
    string ,
    uint ,
    uint , 
    bytes32 ,
    string,
    string,
    uint256,
    uint256) 
    {
        Asset memory asset = assets[_id];
        return(asset._address,asset._id,asset._name,asset._value,asset._quantity,asset._trackId,userIdMap[asset._address]._username,enums.getStringOwnerType(userIdMap[asset._address]._type),asset._createdAt,asset._updatedAt);
    }
  
  } 