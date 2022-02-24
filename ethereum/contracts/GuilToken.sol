pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract GuilToken {
  using SafeMath for uint;

  string public name = "Guil Token";

  string public symbol = "GUIL";

  uint public decimals = 18;

  uint public totalSupply;

  mapping(address => uint) internal _balances;

  mapping(address => mapping(address => uint)) internal _allowances;

  event Transfer(address indexed from, address indexed to, uint value);

  event Approve(address indexed from, address indexed to, uint value);

  event Unapprove(address indexed from, address indexed to, uint value);

  constructor() {
    totalSupply = 1000000 * 10 ** decimals;
    _balances[msg.sender] = totalSupply;
  }

  function balanceOf(address _owner) public view returns (uint) {
    return _balances[_owner];
  }

  function allowance(address _owner, address _spender) public view returns (uint) {
    return _allowances[_owner][_spender];
  }

  function transfer (address _to, uint _value) public returns (bool success) {
    require(_to != address(0));
    require(_value > 0);

    bool _transferred = _handleTransfer(msg.sender, _to, _value);
    require(_transferred);
    emit Transfer(msg.sender, _to, _value);

    return true;
  }

  function approve(address _to, uint _value) public returns (bool success) {
    _subtractFrom(msg.sender, _value);
    _allowances[msg.sender][_to] = _allowances[msg.sender][_to].add(_value);
    emit Approve(msg.sender, _to, _value);

    return true;
  }

  function unapprove(address _to, uint _value) public returns (bool success) {
    require(_to != address(0));
    _subtractFromAllowance(msg.sender, _to, _value);
    _addTo(msg.sender, _value);
    emit Unapprove(msg.sender, _to, _value);

    return true;
  }

  function transferFrom(address _from, address _to, uint _value) public returns (bool success) {
    require(_from != address(0));
    require(_to != address(0));

    _subtractFromAllowance(_from, msg.sender, _value);
    _addTo(_to, _value);

    emit Transfer(_from, _to, _value);

    return true;
  }

  function _handleTransfer(address _from, address _to, uint _value) internal returns (bool success) {
    require(_from != address(0));
    require(_to != address(0));

    _subtractFrom(_from, _value);
    _addTo(_to, _value);

    return true;
  }

  function _addTo(address _subject, uint _value) internal returns (bool success) {
    _balances[_subject] = _balances[_subject].add(_value);

    return true;
  }

  function _subtractFrom(address _subject, uint _value) internal returns (bool success) {
    require(_balances[_subject] >= _value);
    _balances[_subject] = _balances[_subject].sub(_value);

    return true;
  }

  function _subtractFromAllowance(address _allocator, address _subject, uint _value) internal returns (bool success) {
    require(_allowances[_allocator][_subject] >= _value);
    _allowances[_allocator][_subject] = _allowances[_allocator][_subject].sub(_value);

    return true;
  }
}
