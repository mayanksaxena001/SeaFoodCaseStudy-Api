// contract to store database of supply chain parties and their
//reputations
contract Reputation {
// call the Tracking contract at its deployed address
// need to include Tracking contract code at the end
Tracking track =
Tracking(0x0dcd2f752394c41875e259e00bb44fd505297caf);
address admin;
mapping (address => Supplier) suppliers;
address[] suppliersByAddress; // array of all suppliers' accounts
struct Supplier {
string name;
uint phoneNo;
string cityState;
string country;
string goodsType;
uint reputation;
}
// constructor - runs once when contract is deployed
function Reputation() {
admin = msg.sender;
}
// modifier to allow only admin to execute a function
modifier onlyAdmin() {
if (msg.sender != admin) throw;
_;
}
// function for supplier to add their details to database
function addSupplier(string _name, uint _phoneNo, string
_cityState, string _country, string _goodsType) returns (bool success)
{
// don't overwrite existing entries and ensure name isn't null
if (bytes(suppliers[msg.sender].name).length == 0 &&
bytes(_name).length != 0) {
suppliers[msg.sender].name = _name;
suppliers[msg.sender].phoneNo = _phoneNo;
suppliers[msg.sender].cityState = _cityState;
suppliers[msg.sender].country = _country;
87
suppliers[msg.sender].goodsType = _goodsType;
suppliers [msg. sender] .reputation =
track.calculateReputation(msg.sender);
suppliersByAddress.push(msg.sender);
return true;
}
else {
return false; // either entry already exists or name
entered was null
}
}
// function to remove supplier from database (can only be done by
admin)
function removeSupplier(address _supplier) onlyAdmin returns (bool
success) {
delete suppliers[_supplier];
// delete entry from array and shorten array
for (uint i = 0; i < suppliersByAddress.length; i++) {
if (suppliersByAddress[i] == _supplier) {
for (uint index = i; index < suppliersByAddress.length
- 1; index++) {
suppliersByAddress[index] =
suppliersByAddress[index + 1];
}
1];
}
delete suppliersByAddress[suppliersByAddress.length
suppliersByAddress.length--;
}
}
return true;
// function to di
function findSupp
uint, string, string,
return (suppl
suppliers [_supplier].
suppliers [_supplier].
suppliers [_supplier].
}
splay details of supplier
lier(address _supplier) constant returns
string, uint) {
iers[_supplier].name,
phoneNo, suppliers[_supplier].cityState,
country, suppliers[_supplier].goodsType,
reputation);
(string,
// function to display all suppliers' accounts in database
function allSuppliers() constant returns (address[]) {
return suppliersByAddress;
}
88
// function to search for suppliers by type of goods
function filterByGoodsType(string _goodsType) constant returns
(address[]) {
address[] memory filteredGoods = new
address [ (suppliersByAddress. length);
for (uint i = 0; i < suppliersByAddress.length; i++) {
if (sha3(suppliers[suppliersByAddress[i]].goodsType) ==
sha3(_goodsType)) {
filteredGoods[i] = suppliersByAddress[i];
}
}
return filteredGoods;
}
// function to search for suppliers by reputation (returns those
with same or higher reputation)
function filterByReputation(uint _reputation) constant returns
(address[]) {
address[] memory filteredRep = new
address [] (suppliersByAddress. length);
for (uint i = 0; i < suppliersByAddress.length; i++) {
if (suppliers[suppliersByAddress[i]].reputation >=
_reputation) {
filteredRep[i] = suppliersByAddress[i];
}
}
return filteredRep;
}
// function to display reputation of supplier (calls Tracking
contract)
function checkReputation(address _supplier) constant returns
(uint) {
return track.calculateReputation(_supplier);
}
// function to update reputations of all suppliers (calls Tracking
contract)
// can only be done by admin
function updateReputations() onlyAdmin returns (bool success) {
for (uint i = 0; i < suppliersByAddress.length; i++) {
suppliers[suppliersByAddress[i]].reputation =
track.calculateReputation(suppliersByAddress[i]);
}
return true;
}
}