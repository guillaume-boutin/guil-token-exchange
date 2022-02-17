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
// [ ] Withdraw Tokens
// [ ] Check balances
// [ ] Make order
// [ ] Cancel order
// [ ] Fill order
// [ ] Charge fees

contract Exchange {
  using SafeMath for uint;

  address public feeAccount;
  uint public feePercent;

  mapping(address => mapping(address => uint)) internal balances;

  event Deposit(address user, address token, uint amount, uint balance);

  constructor(address _feeAccount, uint _feePercent) {
    feeAccount = _feeAccount;
    feePercent = _feePercent;
  }

  function balanceOf(address _user, address _token) public view returns (uint balance) {
    return balances[_user][_token];
  }

  function deposit(address _token, uint _amount) public {
    require(_token != address(0));

    bool _transferred = GuilToken(_token).transferFrom(msg.sender, address(this), _amount);
    require(_transferred);

    _handleDeposit(msg.sender, _token, _amount);
  }

  function _handleDeposit(address _user, address _token, uint _amount) internal {
    balances[_user][_token] = balances[_user][_token].add(_amount);
    emit Deposit(_user, _token, _amount, balances[_user][_token]);
  }
}
