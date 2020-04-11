pragma solidity ^0.4.24;

import "./AssetTransfer.sol";
import "./Enums.sol";
import "./FCTToken.sol";


contract TelemetryCore  {
    
    using Enums for Enums.Enum;
    Enums.Enum internal enums;
    
    constructor() public {
        enums.addToEnumMapping();
        enums.createEnumMapping();
    }
    
      struct Sensor
    {
        bytes32 _id;
        bytes32 _transactionId;
        address _address;//owner of the sensor
        string _name;
        uint256 _createdAt;
        uint256 _updatedAt;
        uint _status;
    }

    struct Telemetry {
        bytes32 _id;//.. Every specific location
        bytes32 _sensorId;//..For specific sensors
        uint _weight;
        // uint _quantity;
        // uint _value;//..
        uint _temperature;
        string _latitude;
        string _longitude;
        string _place;
        uint256 _updatedAt;
    }

    mapping (bytes32 => Sensor) internal sensors;// mapped with sensorid
    mapping (address => bytes32[]) internal sensorOwners;// mapped with owners/suppliers
    
    mapping (bytes32 => Telemetry) internal telemetries;// mapped with telemetryid
    mapping (bytes32 => bytes32[]) internal sensorTelemetries;//mapped with sensorid
    mapping (bytes32 => bytes32[]) internal transactionTelemetries;//mapped with transaction id

    event LogSensorTelemetryEvent (address _owner,bytes32 _telemetryId, uint _weight, uint _temperature, string _latitude,string _longitude, string _place, uint256 _timestamp);
    event LogSensorAddedEvent  (address _address , bytes32 _sensorId ,string _name, uint256 _timestamp);
    event LogSensorUpdateEvent  (address _supplier,bytes32 _sensorId , string _status , uint256 _timestamp);
    
    modifier NotEmpty(bytes32 _id) {
        require(_id !=bytes32(0) );
        _;
    }
    function updateSensorTelemetry(
        bytes32 _sensorId,
        uint _weight,
        uint _temperature,
        string _latitude,
        string _longitude,
        string _place
    ) public NotEmpty(_sensorId) 
    // isSensorAvailable(_sensorId) 
    {
        Sensor storage sensor = sensors[_sensorId];
        uint256 updateDate = now ;
        sensor._updatedAt = updateDate;
        // sensorOwners[sensor._address][sensor._index] ;
        
        bytes32 _id = createId(sensor._address, sensor._name, _place,now);
        Telemetry memory telemetry = Telemetry( _id,  _sensorId, _weight, _temperature, _latitude, _longitude, _place,now);
        
        telemetries[_id] = telemetry ;
        sensorTelemetries[_sensorId].push(telemetry._id);
        if(sensor._transactionId != bytes32(0))transactionTelemetries[sensor._transactionId].push(telemetry._id);
        emit LogSensorTelemetryEvent( sensor._address,telemetry._id,_weight, _temperature, _latitude, _longitude, _place, now);
        emit LogSensorUpdateEvent(sensor._address,_sensorId,enums.getStringStatusType(sensor._status),now);
      }

      function updateSensorTransactionId(bytes32 _sensorId,bytes32 _transactionId) NotEmpty(_sensorId) public   {
            Sensor storage sensor = sensors[_sensorId];
            require(sensor._status == Enums.getAvailableStatus());
            sensor._updatedAt = now;
            sensor._transactionId = _transactionId;
            sensor._status = Enums.getOnTheWayStatus();
            emit LogSensorUpdateEvent(sensor._address,_sensorId,enums.getStringStatusType(sensor._status),now);
      }
      
      function updateSensor(address _supplier,bytes32 _sensorId,uint _status) NotEmpty(_sensorId) public   {
            Sensor storage sensor = sensors[_sensorId];
            sensor._status = _status;
            sensor._updatedAt = now;
            if(sensor._status == Enums.getAvailableStatus()){
                sensor._transactionId = bytes32(0);
            }
            emit LogSensorUpdateEvent(_supplier,_sensorId,enums.getStringStatusType(_status),now);
      }

         //generates an unique id from the name given and add it to map 
    function addSensor(address _owner , string _name,string _username) external {
           bytes32 _sensorId = createId(_owner,_name,_username,now);
           require(sensors[_sensorId]._status == 0);
           Sensor memory sensor = Sensor(_sensorId,bytes32(0),_owner,_name,now,now,Enums.getAvailableStatus());
           sensors[_sensorId] = sensor;
           sensorOwners[_owner].push(_sensorId);
           emit LogSensorAddedEvent(_owner, _sensorId, _name, now);
    }

    function getSensorById(bytes32 _sensorId) view public  returns(
        bytes32,
        bytes32,
        address,
        string,
        string,
        uint256,
        uint256
    ){
        Sensor memory sensor = sensors[_sensorId];
        return (
            sensor._id,
            sensor._transactionId,
            sensor._address,
            sensor._name,
            enums.getStringStatusType(sensor._status),
            sensor._createdAt,
            sensor._updatedAt
        );
    }

    function getTelemetryById(bytes32 _telemetryId) view public NotEmpty(_telemetryId) returns(
        bytes32,
        bytes32,
        uint,
        uint,
        string,
        string,
        string,
        uint256
    ) {
        Telemetry memory telemetry = telemetries[_telemetryId];
        return (
            telemetry._id,
            telemetry._sensorId,
            telemetry._weight,
            telemetry._temperature,
            telemetry._latitude,
            telemetry._longitude,
            telemetry._place,
            telemetry._updatedAt
        );
    }

    function getSensorsByAddress(address _address) view external  returns(bytes32[]){
        return sensorOwners[_address];
    }

    function getTransactionTelemetries(bytes32 _transactionId) public view returns(bytes32[]) {
        return transactionTelemetries[_transactionId];
    }

    function getSensorTelemetries(bytes32 _sensorId) public view returns(bytes32[]) {
        return sensorTelemetries[_sensorId];
    }

      //generate specific asset id with address and name 
    function createId(address _address,string _name,string _username,uint256 _date) internal pure  returns (bytes32 id) {
        id = bytes32(keccak256(abi.encodePacked(_address,_name,_username,_date)));
     }
    
}