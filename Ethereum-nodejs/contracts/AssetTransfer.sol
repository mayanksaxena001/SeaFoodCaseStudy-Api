pragma solidity ^0.4.24;

import "./AssetOwnership.sol";
import "./TelemetryCore.sol";

contract AssetTransfer is AssetOwnership  {
    
    TelemetryCore internal telemetryCore;

    constructor(string _name,address _telemetryAddress) AssetOwnership(_name) public {
    //
    telemetryCore = TelemetryCore(_telemetryAddress);    
    }

     function updateTransactionSensorId(address _supplier,bytes32 _transactionId,bytes32 _sensorId) external NotEmpty(_sensorId) isSupplier(_supplier) {
        Transaction storage transaction = transactions[_transactionId];
        //update sensor id
        transaction._sensorId = _sensorId;
        transaction._status = Enums.getInProgressStatus();
        // updateTransactionInt(_transactionId,Enums.getInProgressStatus());
        // if(transaction._sensorId == bytes32(0)) // TODO : Check this
        emit  LogTransactionUpdateEvent(transaction._id,enums.getStringStatusType(transaction._status),now);
        telemetryCore.updateSensorTransactionId(_sensorId,_transactionId);
        // emit LogTransactionUpdateEvent (transaction._id , enums.getStringStatusType(transaction._status), now);
    }

    function updateTransactionPickUp(address _supplier,bytes32 _transactionId) external  isSupplier(_supplier) {
        Transaction storage transaction = transactions[_transactionId];
        updateTransactionInt(_transactionId,Enums.getPickedupStatus());
        telemetryCore.updateSensor(_supplier,transaction._sensorId,Enums.getPickedupStatus());
        releaseFunds(transaction._from,transaction._amount);
        releaseFunds(transaction._supplier,transaction._amount);
        transfer(transaction._supplier, (5*transaction._amount)/100);
        transfer(transaction._from, transaction._amount);
        // emit LogTransactionUpdateEvent (transaction._id , enums.getStringStatusType(transaction._status), now);
    }

    function updateTransactionCompleted(address _supplier,bytes32 _transactionId) external  isSupplier(_supplier) {
        Transaction storage transaction = transactions[_transactionId];
        updateTransactionInt(_transactionId,Enums.getDeliveredStatus());
        telemetryCore.updateSensor(_supplier,transaction._sensorId,Enums.getAvailableStatus());
        releaseFunds(transaction._to,transaction._amount);
        releaseFunds(transaction._supplier,transaction._amount);
        transfer(transaction._supplier, (5*transaction._amount)/100);
        //TODO: check for balances
        balances_[transaction._to] = balances_[transaction._to].sub(transaction._amount);
        emit LogTransactionUpdateEvent (transaction._id ,enums.getStringStatusType(transaction._status), now);
    }
    
    //TODO : supplier sensors check
    //DONE : check value passed
    function transferAsset(address _from,address _to,address _supplier,bytes32 _id,uint _quantity ,uint256 _value) external NotEmpty(_id) ownerOf(_from,_id) checkBalance(_to,_quantity*_value) returns(bool)
    {
            Asset storage asset = assets[_id];
           //lock funds
            lockFunds(_from,_value.mul(_quantity));
            lockFunds(_to,_value.mul(_quantity));
            lockFunds(_supplier,_value.mul(_quantity).mul(2));
            updateTransaction(_id,asset,_from,_to,_supplier,asset._value.mul(asset._quantity));
            // TODO update tracking id
            updateAsset(_to,asset._id,asset._value,asset._quantity,asset._trackId);
            addAssetToMap(asset);
            userAssetIds[_from][_id] =false;
            // emit LogDeleteAssetEvent(_from,getUserName(_from),assets[_id]._name,now);
            emit LogTransferAssetEvent(_to,_from,_id,asset._name,asset._value,asset._quantity,now);
    }   

    function cancelTransaction(address _address,bytes32 _transactionId) external isTransactionPending(_transactionId) isExisting(_address) {
            //revert evrything
            Transaction storage transaction = transactions[_transactionId];
            updateTransactionInt(_transactionId,Enums.getCancelledStatus());
            if(transaction._sensorId != bytes32(0))
                telemetryCore.updateSensor(_address,transaction._sensorId,Enums.getAvailableStatus());
            // else {}
            releaseFunds(transaction._from,transaction._amount);
            releaseFunds(transaction._to,transaction._amount);
            releaseFunds(transaction._supplier,transaction._amount*2);//
            emit LogTransactionUpdateEvent (_transactionId , enums.getStringStatusType(Enums.getCancelledStatus()), now);
    }

    function updateTransaction(bytes32 _id,Asset storage _asset, address _from,address _to,address _supplier,uint _amount) internal {
            bytes32 _Tid = createId(_supplier,_asset._name,userIdMap[_supplier]._username,now);//username should be changed to _from
            // No sensor  added while transaction is created
            Transaction memory transaction =  Transaction(_Tid,_from,_to,_supplier,Enums.getPendingStatus(),_id,bytes32(0),_amount,now,now);
            //sensor  must be attached by supplier
            if(transaction._sensorId == 0){
            emit LogSupplierSensorAlert(_supplier,_Tid,enums.getStringStatusType(Enums.getToBeAddedStatus()),now);
            } 
            // else{}; TODO

            transactions[_Tid] = transaction;
            //update transaction id for each user
            userTransactions[_supplier].push(_Tid);
            userTransactions[_to].push(_Tid);
            userTransactions[_from].push(_Tid);
            _asset._trackId = transaction._id;
            updateTransactionInt(transaction._id,transaction._status);
    }
    
    function updateTransactionInt(bytes32 _transactionId,uint _status) internal  {
            Transaction storage transaction = transactions[_transactionId];
            transaction._status = _status;
            transaction._updatedAt = now;
            emit  LogTransactionUpdateEvent(transaction._id,enums.getStringStatusType(transaction._status),now);
    }

    //TODO : supplier sensors check
     function getTransactionIdsByAddress(address _address) view external  isExisting(_address) returns(bytes32[]) {
        return userTransactions[_address];
    }

    function getTransactionById(bytes32 _transactionId) view public NotEmpty(_transactionId) returns(
        bytes32,
        string,
        address,
        address,
        address,
        bytes32,
        bytes32,
        string,
        uint,
        uint256
    ) {
        Transaction memory transaction = transactions[_transactionId];
        string memory _name = assets[transaction._assetId]._name;
        return (
            transaction._id,
            enums.getStringStatusType(transaction._status),
            transaction._from,
            transaction._to,
            transaction._supplier,
            transaction._sensorId,
            transaction._assetId,
            _name,
            transaction._amount,
            transaction._updatedAt
        );
    }

 }