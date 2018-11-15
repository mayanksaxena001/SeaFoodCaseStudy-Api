pragma solidity ^0.4.24;

     
// We have to specify what version of compiler this code will compile with
 contract StateContract
 {
       //will contain both entity ids
    struct TrackState 
    {
      bytes32 _stateId;
      bytes32 _sender_entity_id;
      bytes32 _buyer_entity_id;
      bool _isAlive;
    }
    
    struct StateInfo 
    {
          bytes32 _stateId;//...Each transaction has unique id
          bytes32 _sensorId;
          TransactionInfo _transInfo;
          bool _isAlive;
    }
      
    struct Sensor
    {
          string _name;
          bytes32 _sensorId;
          bytes32 _stateId;
          bool _isAlive;
    }
     
    struct TransactionInfo
    {
         bytes32 _stateId;
         Details _details;
    }
      
    struct Details
    {
         uint _weight;
         uint _quantity;
         string _place;
         string _date;
         uint _amount;//..
    }
     
    struct Telemetry{
         bytes32 _id;//.. Every specific location
         bytes32 _sensorId;//..For specific sensors
         Temperature _temp;
         Location _loc;
         bool _isAlive;
    }
     
    struct Temperature{
         uint _avgTemp;//...
    }
     
    struct Location{
         bytes32 _id;
         string _latitude;
         string _longitude;
         string _location;//...
         bool _isAlive;
    }
     
      
      
    bytes32[] public sensorIds;//..All sensor ids
    bytes32[] public stateIds;//..All state ids
    address private  owner;
      
      //mapped sensor id with its Struct
    mapping (bytes32 => Sensor ) private sensors;//..All sensors
     //map state id to trackstate
    mapping (bytes32 => TrackState) private trackState;
      //mapped every state with its state id
    mapping (bytes32 => StateInfo) private stateInfo;//... Every transaction state
      //mapped each telemetry details with its unique id
    mapping (bytes32 => Telemetry) private telemetries;//...Each Telemetry state
      //map sensor id with its telemetries
    mapping (bytes32 => Telemetry[]) private sensorTelemetries;  
      //mapped location with integer cordinate for now
    mapping (bytes32 => Location) private locationCordinates;//...Map of cordinate with location
    //each entity id with its state
    mapping (bytes32 => TrackState) private entityState;
       
    //TODO Events
       
    function StateContract() public {
           owner=msg.sender;
           addSensor('SENSOR-1');
           addSensor('SENSOR-2');
    }
      
    function checkOwner() internal view {
           require(owner == msg.sender);
    }
       //generates an unique id from the name given and add it to map and array of ids
    function addSensor(string _name) public returns (bytes32){
        //   checkOwner();
           bytes32 _sensorId = createLocId(_name);
           require(!sensors[_sensorId]._isAlive);
           sensors[_sensorId] = Sensor(_name,_sensorId,0,false);
           sensorIds.push(_sensorId);
           return _sensorId;
    }
       
    //returns unique id of mapped transaction state   
    function attachSensor(bytes32 _sensorId,bytes32 _senderEntityId,bytes32 _buyerEntityId,
         uint _weight,
         uint _quantity,
         string _place,
         string _latitude,
         string _longitude,
         string _date,
         uint _amount)
    public 
    returns(bool) 
    {
        //  checkOwner();
        clearSensorIds(_sensorId);
         bytes32 _stateId = createId(_senderEntityId,_buyerEntityId) ;
         Details memory _details = Details(_weight,_quantity,_place,_date,_amount);
         require(!stateInfo[_stateId]._isAlive);
         TransactionInfo memory _transInfo = TransactionInfo(_stateId,_details);
         stateInfo[_stateId] = StateInfo (_stateId,_sensorId,_transInfo,true);
         stateIds.push(_stateId);
         
         trackState[_stateId] = TrackState(_stateId,_senderEntityId,_buyerEntityId,true);
         entityState[_senderEntityId] = trackState[_stateId];
         entityState[_buyerEntityId] = trackState[_stateId];
         updateSensor(_sensorId,_latitude,_longitude,_place, 27);
         updateSensorStateId(_sensorId,_stateId);
         
         return true;
    }
       // update sensor info and returns the unique telemetry id
    function updateSensor(bytes32 _sensorId , string _latitude,string _longitude,string _location ,uint _temp) public returns(bool) {
        //  checkOwner();//check
         isSensorPresent(_sensorId);//check
         bytes32 _id = createLocId(_location);
         locationCordinates[_id] = Location(_id,_latitude,_longitude,_location,true);
         bytes32 _telemetryId = createLocId(_location);
         telemetries[_telemetryId] =  Telemetry (_telemetryId,_sensorId,Temperature(_temp),locationCordinates[_id],true);
         sensorTelemetries[_sensorId].push(telemetries[_telemetryId]);
         sensors[_sensorId]._isAlive = true;
         return true;
    }
    
    function updateSensorStateId(bytes32 _sensorId,bytes32 _stateId) internal returns(bool){
         sensors[_sensorId]._stateId = _stateId;
         return true;
    }
    
    function getSensorByIndex(uint _index) public view returns(bytes32)  {
        //   checkOwner();
           require(_index >= 0 && sensorIds.length > 0);
           return sensorIds[_index];
    }
    
    function getSensorsCount() public view returns(uint)  {
        //   checkOwner();
           return sensorIds.length;
    }
       
       
    function isSensorPresent(bytes32 _sensorId) internal view returns(bool){
            require(sensorIds.length > 0);
            // require(sensors[_sensorId]._isAlive);
            return true;
    }
    
    function clearSensorIds(bytes32 _sensorId) internal view returns(bool){
            delete sensorTelemetries[_sensorId];
            return true;
    }
    
       //get  sensor details excluding telemetries;
    function getSensorDetails(bytes32 _sensorId) public view returns(string,bytes32,bool){
        //   checkOwner();
           isSensorPresent(_sensorId);
           
           return (sensors[_sensorId]._name,sensors[_sensorId]._stateId,sensors[_sensorId]._isAlive);
    }
    
        //get by sensor details excluding telemetries;
    function getSensorTelemetry(bytes32 _sensorId,uint _index) public view returns( bytes32 ,
         uint ,
         string,
         string,string){
        //   checkOwner();
           isSensorPresent(_sensorId);
           bytes32 _id = sensorTelemetries[_sensorId][_index]._id;
           return (telemetries[_id]._id,telemetries[_id]._temp._avgTemp,telemetries[_id]._loc._latitude,telemetries[_id]._loc._longitude,telemetries[_id]._loc._location);
    }
    
        //get by sensor details excluding telemetries;
    function getSensorTelemetryCount(bytes32 _sensorId) public view returns(uint){
        //   checkOwner();
           isSensorPresent(_sensorId);
           return (sensorTelemetries[_sensorId].length);
    }
       
    //track state of the entity using stateId
    function getTransactState(bytes32 _stateId) public constant returns(bytes32,bytes32,bool){
      require(trackState[_stateId]._isAlive);
      return (trackState[_stateId]._sender_entity_id,trackState[_stateId]._buyer_entity_id,trackState[_stateId]._isAlive);
    }
    
     //track state id using entityId
    function getEntityStateId(bytes32 _entityId) public constant returns(bytes32){
      require(entityState[_entityId]._isAlive);
      return (entityState[_entityId]._stateId);
    }
    
    function getTransactionStateIdByIndex(uint _index) public view returns (bytes32) {
        // checkOwner();
        require(_index >= 0 && stateIds.length >0);
        return stateIds[_index];
    }
    
    //All transaction details of the state by unique  state id 
    function getTransactionInfo(bytes32 _stateId)
    public 
    view
    returns(bytes32,uint ,
         uint ,
         string ,
         string ,
         uint )
   { 
    //   checkOwner();
    //   require(stateInfo[_stateId]._isAlive);
      TransactionInfo storage _transInfo = stateInfo[_stateId]._transInfo;
      return (stateInfo[_stateId]._sensorId ,_transInfo._details._weight ,_transInfo._details._quantity,_transInfo._details._place,
      _transInfo._details._date,_transInfo._details._amount);
   } 
  
    //All Telemetry info by its unique id;    
    function getTelemetryInfo(bytes32 _id)
    public 
    view
    returns( bytes32 ,
         uint ,
         string,
         string,string)
    {
      checkOwner();
      require(telemetries[_id]._isAlive);
      return (telemetries[_id]._sensorId,telemetries[_id]._temp._avgTemp,telemetries[_id]._loc._latitude,telemetries[_id]._loc._longitude,telemetries[_id]._loc._location);
    } 
  
  
       //get location name by cordinates
    function getLocation(bytes32 _id)
    public 
    view
    returns(string)
    {
    //   checkOwner();
      require(locationCordinates[_id]._isAlive);
      return locationCordinates[_id]._location;
    }
       /** Id generated of address
     * @dev Creates a new blob. It is guaranteed that different users will never receive the same blobId, even before consensus has been reached. This prevents blobId sniping.
     * @return blobId Id of the blob.
     */
    function create(address _address) internal pure returns (bytes32 blobId) 
    {
        // Generate the blobId.
        blobId = bytes32(keccak256(_address));
    }
       
           /** Id generated of string
     * @dev Creates a new blob. It is guaranteed that different users will never receive the same blobId, even before consensus has been reached. This prevents blobId sniping.
     * @return blobId Id of the blob.
     */
    function createLocId(string _string) internal pure returns (bytes32 blobId)
    {
        // Generate the blobId.
        blobId = bytes32(keccak256(_string));
    }
       
         //generate specific id with entity id and name 
    function createId(bytes32 _id1,bytes32 _id2) internal pure returns (bytes32 blobId)
    {
        // Generate the blobId.
        blobId = bytes32(keccak256(_id1,_id2));
    }
  
    function deleteTelemetryInfo(bytes32 _id) public  returns (bool){
    //   checkOwner();//check
      require(telemetries[_id]._isAlive);
      telemetries[_id]._isAlive =  false;
      delete  telemetries[_id];
      return true;
    }
  
    function deleteTransactionState(bytes32 _id) public  returns (bool){
    //   checkOwner();//check
      require(stateInfo[_id]._isAlive);
      stateInfo[_id]._isAlive =  false;
      delete  stateInfo[_id];
      return true;
    }
  
  }