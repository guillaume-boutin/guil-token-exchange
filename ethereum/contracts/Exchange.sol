pragma solidity ^0.8.0;

import "./GuilToken.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

// Deposit & Withdraw Funds
// Manage Orders - Make or Cancel
// Handle Trades - Charge fees

// TODO:
// [x] Set the fee account
// [x] Deposit Ether
// [x] Withdraw Ether
// [x] Deposit Tokens
// [x] Withdraw Tokens
// [x] Check balances
// [x] Place order
// [ ] Cancel order
// [ ] Fill order
// [ ] Charge fees

contract Exchange {
  using SafeMath for uint;

  address public feeAccount;

  uint public feePercent;

  mapping(address => mapping(address => uint)) internal balances;

  uint internal ordersCount = 0;

  mapping(uint => _Order) internal orders;

  mapping(uint => _Order) internal openOrders;

  mapping(uint => _Order) internal cancelledOrders;

  mapping(uint => _Order) internal filledOrders;

  mapping(address => mapping(address => uint)) internal offerBalances;

  event Deposit(address user, _Token token, uint balance);

  event Withdraw(address user, _Token token, uint balance);

  event Order(uint id, address user, _Token offer, _Token demand, uint timestamp);

  event Cancel(_Order order, uint timestamp);

  struct _Token {
    address contractAddress;
    uint amount;
  }

  struct _Order {
    uint id;
    address user;
    _Token offer;
    _Token demand;
    uint timestamp;
  }

  constructor(address _feeAccount, uint _feePercent) {
    feeAccount = _feeAccount;
    feePercent = _feePercent;
  }

  function balanceOf(address _user, address _token) public view returns (uint) {
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

  function order(uint _id) public view returns (_Order memory) {
    return orders[_id];
  }

  function openOrder(uint _id) public view returns (_Order memory) {
    return openOrders[_id];
  }

  function cancelledOrder(uint _id) public view returns (_Order memory) {
    return cancelledOrders[_id];
  }

  function filledOrder(uint _id) public view returns (_Order memory) {
    return filledOrders[_id];
  }

  function offerBalance(address _user, address _token) public view returns (uint) {
    return offerBalances[_user][_token];
  }

  function placeOrder(_Token memory _offer, _Token memory _demand) public {
    require(_offer.amount > 0);
    require(_demand.amount > 0);
    require(balances[msg.sender][_offer.contractAddress] >= _offer.amount);

    uint _id = ordersCount.add(1);
    uint _timestamp = block.timestamp;

    orders[_id] = _Order(_id, msg.sender, _offer, _demand, _timestamp);
    openOrders[_id] = _Order(_id, msg.sender, _offer, _demand, _timestamp);
    _subtractFromBalance(msg.sender, _offer);
    offerBalances[msg.sender][_offer.contractAddress] = offerBalances[msg.sender][_offer.contractAddress].add(_offer.amount);

    emit Order(_id, msg.sender, _offer, _demand, _timestamp);
  }

  function cancelOrder(uint _id) public {
    _Order storage _order = orders[_id];

    require(_order.id == _id);
    require(_order.user == msg.sender);
    require(cancelledOrders[_id].id == 0);

    cancelledOrders[_id] = _order;
    delete openOrders[_id];

    emit Cancel(_order, block.timestamp);
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
