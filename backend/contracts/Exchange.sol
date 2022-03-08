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
// [x] Cancel order
// [x] Fill order
// [x] Charge fees

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

  event Trade(_Order order, address user, uint timestamp);

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
    require(_transferred, "Couldn't transfer");
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

    ordersCount = ordersCount.add(1);
    uint _id = ordersCount;
    uint _timestamp = block.timestamp;

    orders[_id] = _Order(_id, msg.sender, _offer, _demand, _timestamp);
    openOrders[_id] = _Order(_id, msg.sender, _offer, _demand, _timestamp);
    _subtractFromBalance(msg.sender, _offer);
    _addToOfferBalance(msg.sender, _offer);

    emit Order(_id, msg.sender, _offer, _demand, _timestamp);
  }

  function cancelOrder(uint _id) public {
    _Order memory _order = orders[_id];

    require(_order.id == _id);
    require(_order.user == msg.sender);
    require(cancelledOrders[_id].id == 0);

    _subtractFromOfferBalance(msg.sender, _order.offer);
    _addToBalance(msg.sender, _order.offer);

    cancelledOrders[_id] = _order;
    delete openOrders[_id];

    emit Cancel(_order, block.timestamp);
  }

  function fillOrder(uint _id) public {
    _Order memory _order = openOrders[_id];

    require(_order.id == _id);
    require(_order.user != msg.sender);

    uint _takerBalance = balanceOf(msg.sender, _order.demand.contractAddress);
    uint _feeAmount = _order.demand.amount.mul(feePercent).div(10000);

    require(_takerBalance >= _order.demand.amount.add(_feeAmount));

    uint _sellerBalance = offerBalances[_order.user][_order.offer.contractAddress];
    require(_sellerBalance >= _order.offer.amount);

    _Token memory _feeAddedDemand = _Token(_order.demand.contractAddress, _order.demand.amount.add(_feeAmount));

    _subtractFromBalance(msg.sender, _feeAddedDemand);
    _addToBalance(_order.user, _order.demand);

    _subtractFromOfferBalance(_order.user, _order.offer);
    _addToBalance(msg.sender, _order.offer);

    _addToBalance(feeAccount, _Token(_order.demand.contractAddress, _feeAmount));

    filledOrders[_id] = _order;
    delete openOrders[_id];

    emit Trade(_order, msg.sender, block.timestamp);
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

  function _addToOfferBalance(address _user, _Token memory _token) internal {
    offerBalances[_user][_token.contractAddress] = offerBalances[_user][_token.contractAddress].add(_token.amount);
  }

  function _subtractFromOfferBalance(address _user, _Token memory _token) internal {
    require(offerBalances[_user][_token.contractAddress] >= _token.amount);
    offerBalances[_user][_token.contractAddress] = offerBalances[_user][_token.contractAddress].sub(_token.amount);
  }
}
