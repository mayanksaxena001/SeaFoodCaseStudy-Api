pragma solidity ^0.4.24;

// import "./IERC20.sol";
import "./SafeMath.sol";
import "./Ownable.sol";


/**
 * @title Standard ERC20 token
 *
 * @dev Implementation of the basic standard token.
 * https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md
 * Originally based on code by FirstBlood: https://github.com/Firstbloodio/token/blob/master/smart_contract/FirstBloodToken.sol
 */
contract FCTToken is Ownable {
  using SafeMath for uint256;

  mapping (address => uint256) internal balances_;

  mapping (address => mapping (address => uint256)) internal allowed_;

  mapping (address => uint256) internal lockedFunds;

  uint256 private totalSupply_;
  
  string private name_;
  string private symbol_;
  uint8 private decimals_;

  event LogLockedFundsEvent (address _address,uint256 _value);
  event LogReleasedFundsEvent (address _address,uint256 _value);
  event Transfer(address indexed from,address indexed to, uint256 value  );
  event Approval(  address indexed owner,  address indexed spender,  uint256 value );

  constructor() public {
    name_ = 'FCT Token';
    symbol_ = 'FCT';
    decimals_ = 10;
    totalSupply_=10000000000;
    balances_[msg.sender] = totalSupply_;
    emit Transfer(address(0), msg.sender, totalSupply_);
  }

  modifier checkBalance(address _address,uint256 _amount) {
          require(balanceOf(_address) >= _amount);
          _;
 }

  function tokenDetails() public view returns(string,string,uint8,uint256) {
    return (name_,symbol_,decimals_,totalSupply_);
  }

  function balanceOf(address _owner) public view returns (uint256) {
    return balances_[_owner];
  }

  function allowance(
    address _owner,
    address _spender
   )
    public
    view
    returns (uint256)
  {
    return allowed_[_owner][_spender];
  }

  function transfer(address _to, uint256 _value) public returns (bool) {
    require(_value <= balances_[msg.sender],'');
    require(_to != address(0),'');
    //msg.sender can be changed to owner
    balances_[msg.sender] = balances_[msg.sender].sub(_value);
    balances_[_to] = balances_[_to].add(_value);
    emit Transfer(msg.sender, _to, _value);
    return true;
  }

  function transferTokens(address _from,address _to,uint256 _value) public onlyMembers(_from) checkBalance(_from,_value) {
    balances_[_from] = balances_[_from].sub(_value);
    balances_[_to] = balances_[_to].add(_value);
    emit Transfer(_from, _to, _value);
  }

  function approve(address _spender, uint256 _value) public returns (bool) {
    allowed_[msg.sender][_spender] = _value;
    emit Approval(msg.sender, _spender, _value);
    return true;
  }
  
  function transferFrom(
    address _from,
    address _to,
    uint256 _value
  )
    public
    returns (bool)
  {
    require(_value <= balances_[_from]);
    require(_value <= allowed_[_from][msg.sender]);
    require(_to != address(0));

    balances_[_from] = balances_[_from].sub(_value);
    balances_[_to] = balances_[_to].add(_value);
    allowed_[_from][msg.sender] = allowed_[_from][msg.sender].sub(_value);
    emit Transfer(_from, _to, _value);
    return true;
  }

  function mint(uint256 _amount) onlyOwner public {
    require(msg.sender != 0);
    totalSupply_ = totalSupply_.add(_amount);
    balances_[msg.sender] = balances_[msg.sender].add(_amount);
    emit Transfer(address(0), msg.sender, _amount);
  }

  function lockFunds(address _address,uint256 _amount) checkBalance(_address,_amount) onlyOwner internal {
    lockedFunds[_address] = _amount;
    balances_[_address] = balances_[_address].sub(_amount);
    // balances_[owner] = balances_[owner].add(_amount);
    emit LogLockedFundsEvent(_address,_amount);
  }

  function releaseFunds(address _address,uint _amount) onlyOwner internal
    {
    lockedFunds[_address] = lockedFunds[_address].sub(_amount);
    balances_[_address] = balances_[_address].add(_amount);
    emit LogReleasedFundsEvent(_address,_amount);
    }
    
  function equals(bytes32 a, bytes32 b) internal pure returns (bool)
     {
       return bytes32(keccak256(abi.encodePacked(a))) == bytes32(keccak256(abi.encodePacked(b)));
     }
     
     //generate specific asset id with address and name 
    function createId(address _address,string _name,string _username,uint256 _date) internal view onlyMembers(_address) returns (bytes32 id) {
        id = bytes32(keccak256(abi.encodePacked(_address,_name,_username,_date)));
     }

}