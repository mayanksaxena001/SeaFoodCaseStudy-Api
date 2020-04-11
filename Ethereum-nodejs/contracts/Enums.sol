pragma solidity ^0.4.24;


/**
 * @title Enums
 * @author Mayank Saxena
 * @dev Library for managing addresses assigned to a Role.
 * See RBAC.sol for example usage.
 */
library Enums {

    //enums
    enum Status {
        //for sensors
        DEAD ,
        ALIVE ,
        AVAILABLE ,
        TO_BE_ADDED ,
        ON_THE_WAY ,
        PICKED_UP, 
        DELIVERED ,
        //for transaction
        IN_PROGRESS ,
        COMPLETED ,
        CANCELLED ,
        PENDING ,
        SUCCESS 
        // can be added later
    }
    
    enum OwnerType {
         ADMIN,
         PRODUCER,
         CONSUMER,
         SUPPLIER
          // can be added later
    }
    
    struct Enum {
        //enums are converted to uint
        mapping(uint => string)  enumOwnerType;
        mapping(uint => string)  enumStatusType;
    }
    
    function addToEnumMapping(Enum storage _enum) internal {
        _enum.enumStatusType[(uint(Status.AVAILABLE))] = "AVAILABLE";
        _enum.enumStatusType[(uint(Status.ON_THE_WAY))] = "ON_THE_WAY";
        _enum.enumStatusType[(uint(Status.COMPLETED))] = "COMPLETED";
        _enum.enumStatusType[(uint(Status.DELIVERED))] = "DELIVERED";
        _enum.enumStatusType[(uint(Status.PENDING))] = "PENDING";
        _enum.enumStatusType[(uint(Status.SUCCESS))] = "SUCCESS";
        _enum.enumStatusType[(uint(Status.DEAD))] = "DEAD";
        _enum.enumStatusType[(uint(Status.ALIVE))] = "ALIVE";
        _enum.enumStatusType[(uint(Status.TO_BE_ADDED))] = "TO_BE_ADDED";
        _enum.enumStatusType[(uint(Status.IN_PROGRESS))] = "IN_PROGRESS";  
        _enum.enumStatusType[(uint(Status.PICKED_UP))] = "PICKED_UP";   
        _enum.enumStatusType[(uint(Status.CANCELLED))] = "CANCELLED";
    }
    
    function createEnumMapping(Enum storage _enum) internal {
        _enum.enumOwnerType[(uint(OwnerType.ADMIN))] = "ADMIN";
        _enum.enumOwnerType[(uint(OwnerType.PRODUCER))] = "PRODUCER";
        _enum.enumOwnerType[(uint(OwnerType.CONSUMER))] = "CONSUMER";
        _enum.enumOwnerType[(uint(OwnerType.SUPPLIER))] = "SUPPLIER";
    }
    
    function getStringStatusType(Enum storage _enum,uint _type) view internal returns(string) {
            return _enum.enumStatusType[(_type)];
    }
   
    function getStringOwnerType(Enum storage _enum,uint _type) view internal returns(string) {
          return _enum.enumOwnerType[(_type)];
    }

    function getPendingStatus() internal pure returns(uint) {
        return uint(Status.PENDING);
    }

    function getAliveStatus() internal pure returns(uint) {
        return uint(Status.ALIVE);
    }

    function getAvailableStatus() internal pure returns(uint) {
        return uint(Status.AVAILABLE);
    }

    function getDeadStatus()  internal pure returns(uint) {
        return uint(Status.DEAD);
    }

    function getToBeAddedStatus() internal pure returns(uint) {
        return uint(Status.TO_BE_ADDED);
    }

    function getOnTheWayStatus() internal pure returns(uint) {
        return uint(Status.ON_THE_WAY);
    }

    function getPickedupStatus() internal pure returns(uint) {
        return uint(Status.PICKED_UP);
    }

    function getDeliveredStatus() internal pure returns(uint) {
        return uint(Status.DELIVERED);
    }

    function getInProgressStatus() internal pure returns(uint) {
        return uint(Status.IN_PROGRESS);
    }

    function getCompletedStatus() internal pure returns(uint) {
        return uint(Status.COMPLETED);
    }

    function getCancelledStatus() internal pure returns(uint) {
        return uint(Status.CANCELLED);
    }

    function getSuccessStatus() internal pure returns(uint) {
        return uint(Status.SUCCESS);
    }

    function getAdminOwnerType() internal pure returns(uint) {
        return uint(OwnerType.ADMIN);
    }

    function getConsumerOwnerType() internal pure returns(uint) {
        return uint(OwnerType.CONSUMER);
    }

    function getSupplierOwnerType() internal pure returns(uint) {
        return uint(OwnerType.SUPPLIER);
    }

    function getProducerOwnerType() internal pure returns(uint) {
        return uint(OwnerType.PRODUCER);
    }
 
}


