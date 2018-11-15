// contract to allow supply chain parties and consumers to check the
// provenance of goods
contract Provenance {
address admin;
mapping (address => Producer) producers;
mapping (string => Product) products;
struct Producer {
string name;
uint phoneNo;
string cityState;
string country;
bool certified;
}
struct Product {
address producer;
uint[] locationData; // array containing lat & long
uint timeStamp;
}
// constructor - runs once when contract is deployed
function Provenance() {
admin = msg.sender;
}
// modifier to allow only admin to execute a function
modifier onlyAdmin() {
if (msg.sender != admin) throw;
}
// function for producer to add their details to database
function addProducer(string _name, uint _phoneNo, string
_cityState, string _country) returns (bool success) {
// don't overwrite existing entries and ensure name isn't null
if (bytes(producers[msg.sender].name).length == 0 &&
bytes(_name).length != 0) {
producers[msg.sender].name = _name;
producers[msg.sender].phoneNo = _phoneNo;
producers[msg.sender].cityState = _cityState;
producers[msg.sender].country = _country;
producers[msg.sender].certified = false;
80
return true;
}
else {
return false; // either entry already exists or name
entered was null
}
}
// function to remove producer from database (can only be done by
admin)
function removeProducer(address _producer) onlyAdmin returns (bool
success) {
delete producers [_producer];
return true;
}
// function to display details of producer
function findProducer(address _producer) constant returns (string,
uint, string, string, bool) {
return (producers[_producer].name,
producers[_producer].phoneNo, producers[_producer].cityState,
producers[_producer].country, producers[_producer].certified);
}
// function to certify producer as legitimate (can only be done by
admin)
function certifyProducer(address _producer) onlyAdmin returns
(bool success) {
producers [_producer] .certified = true;
return true;
}
// function for producer to add their product to database
function addProduct(string serialNo, uint[] _locationData) returns
(bool success) {
// ensure no duplicate serial numbers and serial number isn't
null
if (products[serialNo].producer == OxO &&
bytes(serialNo).length != 0) {
products [serialNo].producer = msg.sender;
products[serialNo].locationData = _locationData;
products[serialNol.timeStamp = block.timestamp;
return true;
}
else {
return false; // either serial number already in use or
serial number entered was null
81
} }
// function to remove product from database (can only be done by admin)
function removeProduct(string serialNo) onlyAdmin returns (bool
success) {
delete products [serialNo];
return true;
}
// function to display details of product
function findProduct(string serialNo) constant returns (address, uint[], uint) {
return (products[serialNo].producer,
products [serialNo] .locationData, products[serialNo] .timeStamp);
} }
82
Appendix B: Tracking Smart Contract Code
// contract to allow supply chain parties to track shipment of goods
and automatically execute payment in tokens
contract Tracking {
address admin;
uint[] contractLocation; // array containing lat & long
uint contractLeadTime; // in seconds
uint contractPayment; // in tokens
mapping (string => Shipment) shipments;
mapping (address => uint) balances;
mapping (address => uint) totalShip