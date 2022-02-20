pragma solidity ^0.8.0;

import "./GuilToken.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

// Deposit & Withdraw Funds
// Manage Orders - Make or Cancel
// Handle Trades - Charge fees

// TODO:
// [x] Set the fee account
// [ ] Deposit Ether
// [ ] Withdraw Ether
// [x] Deposit Tokens
// [x] Withdraw Tokens
// [ ] Check balances
// [ ] Make order
// [ ] Cancel order
// [ ] Fill order
// [ ] Charge fees

contract Exchange {
  using SafeMath for uint;

  address private _sender;

  address _contractAddress;

  address public feeAccount;

  uint public feePercent;

  mapping(address => mapping(address => uint)) internal balances;

  event Deposit(address user, _Token token, uint balance);

  event Withdraw(address user, _Token token, uint balance);

  struct _Token {
    address contractAddress;
    uint amount;
  }

  struct _Trade {
    _Token offer;
    _Token demand;
  }

  struct _Order {
    uint id;
    address user;
    _Trade exchange;
    uint timestamp;
  }

  constructor(address _feeAccount, uint _feePercent) {
    feeAccount = _feeAccount;
    feePercent = _feePercent;
    _sender = msg.sender;
    _contractAddress = address(this);
  }

  function senderAddress() public view returns (address) {
    return _sender;
  }

  function contractAddress() public view returns (address) {
    return _contractAddress;
  }

  function balanceOf(address _user, address _token) public view returns (uint balance) {
    return balances[_user][_token];
  }

  function deposit(_Token memory _token) public {
    require(_token.contractAddress != address(0));
    bool _transferred = GuilToken(_token.contractAddress).transferFrom(msg.sender, address(this), _token.amount);
    require(_transferred);
    _handleDeposit(msg.sender, _token);
  }

  function withdraw(_Token memory _token) public {
    require(_token.contractAddress != address(0));

    bool _transferred = GuilToken(_token.contractAddress).transfer(msg.sender, _token.amount);
    require(_transferred);

    _handleWithdraw(msg.sender, _token);
  }

  function depositEther() public payable {
    _handleDeposit(msg.sender, _Token(address(0), msg.value));
  }

  function withdrawEther(uint _amount) public {
    _handleWithdraw(msg.sender, _Token(address(0), _amount));
    payable(msg.sender).transfer(_amount);
  }

  function _handleDeposit(address _user, _Token memory _token) internal {
    _addToBalance(_user, _token);
    emit Deposit(_user, _token, balances[_user][_token.contractAddress]);
  }

  function _handleWithdraw(address _user, _Token memory _token) internal {
    require(balanceOf(msg.sender, _token.contractAddress) >= _token.amount);

    _subtractFromBalance(_user, _token);
    emit Withdraw(_user, _token, balances[_user][_token.contractAddress]);
  }

  function _addToBalance(address _user, _Token memory _token) internal {
    balances[_user][_token.contractAddress] = balances[_user][_token.contractAddress].add(_token.amount);
  }

  function _subtractFromBalance(address _user, _Token memory _token) internal {
    require(balances[_user][_token.contractAddress] >= _token.amount);
    balances[_user][_token.contractAddress] = balances[_user][_token.contractAddress].sub(_token.amount);
  }
}
