# Guil Token Exchange

This is my take on
[DApp University's Bootcamp project](https://dappuniversity.teachable.com/p/blockchain-developer-bootcamp), an
online platform for exchanging mock GUIL tokens for ETH. The backend is based on two Solidity contracts, `GuilToken.sol`,
which in principle follows the ERC-20 standard, and `Exchange.sol` for the trading platform.

The project diverged a bit from DApp University's not so much in the
functionalities, but in the implementations.

- Using Next.js instead of Create React App
- Replaced Redux for Mobx and Context for state management
- Added live refresh of balances when Depositing, Withdrawing, or acting on an Order
- Changed the overall architecture to follow a more object-oriented approach

You can see and interact with the [live version](https://guil-exchange.herokuapp.com) if you have a Kovan wallet, otherwise
you can install it locally by running [Ganache](https://trufflesuite.com/ganache/index.html) as a local blockchain.

## How it works

To start trading, connect your Metamask wallet, then go to `Balance` and make a Deposit from your Wallet to the Exchange.
Once done go to `New Order` and place an offer for either buying or selling GUIL in exchange for ETH. Your order will be
shown on the `Order Book` for anyone interested to take it at the price you set. It will stay there until someone
takes it, or you cancel it. Prices are set by the traders themselves, and the current price shown on the chart is simply
the one for the latest trade taken.

## Installation locally

Clone this repo, and in addition to installing Ganache for running a local blockchain, you will need to install
[Truffle](https://trufflesuite.com/docs/truffle/) with `npm install -g truffle`. Migrate the contracts with `truffle migrate`
then start the project with `npm run dev`. The project will be running on http://localhost:8080.
