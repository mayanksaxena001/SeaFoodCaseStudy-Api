// contract to allow supply chain parties to track shipment of goods
//and automatically execute payment in tokens
contract Tracking {
address admin;
uint[] contractLocation; // array containing lat & long
uint contractLeadTime; // in seconds
uint contractPayment; // in tokens
mapping (string => Shipment) shipments;
mapping (address => uint) balances;
mapping (address => uint) totalShipped; // total number of
shipments made
mapping (address => uint) successShipped; // number of shipments
successfully completed
struct Shipment {
string item;
uint quantity;
uint[] locationData;
uint timeStamp;
address sender;
}
// events to display messages when certain transactions are
executed
event Success(string _message, string trackingNo, uint[]
_locationData, uint _timeStamp, address _sender);
event Payment(string _message, address _from, address _to,
_amount);
event Failure(string _message);
// constructor - runs once when contract is deployed
// determine initial token supply upon contract deployment
function Tracking(uint _initialTokenSupply) {
admin = msg.sender;
balances[admin] = _initialTokenSupply; // all tokens he
admin initially
}
uint
ld by
// modifier to allow only admin to execute
modifier onlyAdmin() {
if (msg.sender admin) throw;
_;
}
a function
83
// function to send tokens from one account to another
function sendToken(address _from, address _to, uint _amount)
returns (bool success) {
if (balances[_from] < _amount) {
Failure('Insufficient funds to send payment');
return false;
}
balances[_from] -= _amount;
balances[_to] += _amount;
Payment('Payment sent', _from, _to, _amount);
return true;
}
// function to show token balance of an account
function getBalance(address _account) constant returns (uint
_balance) {
return balances[_account];
}
// function to recover tokens from an account (can only be done by
admin)
// in the event that the sendToken function gets abused
function recoverToken(address _from, uint _amount) onlyAdmin
returns (bool success) {
if (balances[_from] < _amount) {
Failure('Insufficient funds for recovery');
return false;
}
balances[_from] -= _amount;
balances[msg.sender] += _amount;
Payment('Funds recovered', _from, msg.sender, _amount);
return true;
}
// function to set contract parameters for next leg of shipment
(can only be done by admin)
function setContractParameters(uint[] _location, uint _leadTime,
uint _payment) onlyAdmin returns (bool success) {
contractLocation = _location; // set next location that will
receive shipment
contractLeadTime = _leadTime; // set acceptable lead time for
next leg of shipment
contractPayment = _payment; // set payment amount for
completing next leg of shipment
return true;
}
// function for party to input details of shipment that was sent
84
function sendShipment(string trackingNo, string _item, uint
_quantity, uint[] _locationData) returns (bool success) {
shipments[trackingNo].item = _item;
shipments[trackingNo].quantity = _quantity;
shipments[trackingNo].locationData = _locationData;
shipments[trackingNo].timeStamp = block.timestamp;
shipments[trackingNo].sender = msg.sender;
totalShipped[msg.sender] += 1;
Success('Item shipped', trackingNo, _locationData,
block.timestamp, msg.sender);
return true;
}
// function for party to input details of shipment that was
received
function receiveShipment(string trackingNo, string _item, uint
_quantity, uint[] _locationData) returns (bool success) {
// check that item and quantity received match item and
quantity shipped
if (sha3(shipments[trackingNo].item) == sha3(_item) &&
shipments[trackingNo].quantity == _quantity) {
successShipped[shipments[trackingNo].sender] += 1;
Success('Item received', trackingNo, _locationData,
block.timestamp, msg.sender);
// execute payment if item received on time and location
correct
if (block.timestamp <= shipments[trackingNo].timeStamp
contractLeadTime && _locationData[0] == contractLocation[0] &&
_locationData[1] == contractLocation[1]) {
sendToken(admin, shipments[trackingNo].sender,
contractPayment);
}
else {
Failure('Payment not triggered as criteria not met');
}
return true;
}
else {
Failure('Error in item/quantity');
return false;
}
}
// function to remove details of shipment from database (can only
be done by admin)
85
function deleteShipment(string trackingNo) onlyAdmin returns (bool success) {
delete shipments[trackingNo];
return true;
}
// function to display details of shipment
function checkShipment(string trackingNo) constant returns
(string, uint, uint[], uint, address) {
return (shipments[trackingNo].item,
shipments[trackingNo].quantity, shipments[trackingNo].locationData,
shipments[trackingNo].timeStamp, shipments[trackingNo].sender);
}
// function to display number of successfully completed shipments and total shipments for a party
function checkSuccess(address _sender) constant returns (uint, uint) {
return (successShipped[_sender], totalShipped[_sender]);
}
// function to calculate reputation score of a party (percentage of successfully completed shipments)
function calculateReputation(address _sender) constant returns
(uint) {
if (totalShipped[_sender] 0) {
return (100 * successShipped[_sender]
totalShipped[_sender]);
}
else {
return 0;
} }
}