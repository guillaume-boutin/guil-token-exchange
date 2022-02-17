pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract GuilToken {
  using SafeMath for uint;

  string public name = "Guil Token";
  string public symbol = "GUIL";
  uint public decimals = 18;
  uint public totalSupply;
  mapping(address => uint) public balanceOf;
  mapping(address => mapping(address => uint)) public allowance;

  event Transfer(address indexed from, address indexed to, uint value);
  event Approve(address indexed from, address indexed to, uint value);
  event Unapprove(address indexed from, address indexed to, uint value);

  constructor() public {
    totalSupply = 1000000 * 10 ** decimals;
    balanceOf[msg.sender] = totalSupply;
  }

  function transfer (address _to, uint _value) public returns (bool success) {
    bool _result = _handleTransfer(msg.sender, _to, _value);

    emit Transfer(msg.sender, _to, _value);

    return true;
  }

  function approve(address _to, uint _value) public returns (bool success) {
    _subtractFrom(msg.sender, _value);
    allowance[msg.sender][_to] = allowance[msg.sender][_to].add(_value);
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

  function _handleTransfer(address _from, address _to, uint _value) internal returns (bool success) {
    require(_from != address(0));
    require(_to != address(0));

    _subtractFrom(_from, _value);
    _addTo(_to, _value);

    return true;
  }

  function _addTo(address _subject, uint _value) internal returns (bool success) {
    balanceOf[_subject] = balanceOf[_subject].add(_value);
    return true;
  }

  function _subtractFrom(address _subject, uint _value) internal returns (bool success) {
    require(balanceOf[_subject] >= _value);
    balanceOf[_subject] = balanceOf[_subject].sub(_value);
    return true;
  }

  function _subtractFromAllowance(address _allocator, address _subject, uint _value) internal returns (bool success) {
    require(allowance[_allocator][_subject] >= _value);
    allowance[_allocator][_subject] = allowance[_allocator][_subject].sub(_value);
    return true;
  }
}
