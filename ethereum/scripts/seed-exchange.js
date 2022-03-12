const { toWei, ETHER_ADDRESS } = require("../test/helpers");
const GuilToken = artifacts.require("GuilToken");
const Exchange = artifacts.require("Exchange");

const wait = (seconds) => {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};

module.exports = async (done) => {
  try {
    await handle();
  } catch (err) {
    console.error(err);
  }

  done();
};

const randEth = () => {
  return toWei(Math.round(100 + 30 * (Math.random() - 0.5)) / 100000);
};

const randGuil = () => {
  return toWei(Math.round(100 + 30 * (Math.random() - 0.5)));
};

const handle = async () => {
  // Fetch accounts from wallet - these are unlocked
  const accounts = await web3.eth.getAccounts();

  // Fetch the deployed token
  const guilToken = await GuilToken.deployed();
  console.log("Token fetched", guilToken.address);

  // Fetch the deployed exchange
  const exchange = await Exchange.deployed();
  console.log("Exchange fetched", exchange.address);

  // Set up exchange users
  // Give tokens to user1
  const [user1, user2] = accounts;

  const guilTokensTransfer = 10000;
  await guilToken.transfer(user2, toWei(guilTokensTransfer), { from: user1 });
  console.log(
    `Transferred ${guilTokensTransfer} tokens from ${user1} to ${user2}`
  );

  // User 1 Deposits Ether
  ethDeposit = 1;
  await exchange.depositEther({ from: user1, value: toWei(ethDeposit) });
  console.log(`Deposited ${ethDeposit} Ether from ${user1}`);

  // User 2 Approves Tokens
  await guilToken.approve(exchange.address, toWei(guilTokensTransfer), {
    from: user2,
  });
  console.log(`Approved ${guilTokensTransfer} tokens from ${user2}`);

  // User 2 Deposits Tokens
  await exchange.deposit(
    {
      contractAddress: guilToken.address,
      amount: toWei(guilTokensTransfer),
    },
    {
      from: user2,
    }
  );
  console.log(`Deposited ${guilTokensTransfer} tokens from ${user2}`);

  ////////////////////////////
  // Seed a Cancelled Order //
  ////////////////////////////

  // User 1 makes order demanding for guilTokens
  let result, orderId;
  result = await exchange.placeOrder(
    {
      contractAddress: ETHER_ADDRESS,
      amount: randEth(),
    },
    {
      contractAddress: guilToken.address,
      amount: randGuil(),
    },
    { from: user1 }
  );
  console.log(`Made order from ${user1}`);

  // User 1 cancels order
  orderId = result.logs[0].args.id;
  await exchange.cancelOrder(orderId, { from: user1 });
  console.log(`Cancelled order from ${user1}`);

  ////////////////////////
  // Seed Filled Orders //
  ////////////////////////

  // User 1 makes order
  result = await exchange.placeOrder(
    {
      contractAddress: ETHER_ADDRESS,
      amount: randEth(),
    },
    {
      contractAddress: guilToken.address,
      amount: randGuil(),
    },
    { from: user1 }
  );
  console.log(`Made order from ${user1}`);

  // User 2 fills order
  orderId = result.logs[0].args.id;
  await exchange.fillOrder(orderId, { from: user2 });
  console.log(`Filled order from ${user1}`);

  // Wait 1 second
  await wait(1);

  // User 1 makes another order
  result = await exchange.placeOrder(
    {
      contractAddress: ETHER_ADDRESS,
      amount: randEth(),
    },
    {
      contractAddress: guilToken.address,
      amount: randGuil(),
    },
    { from: user1 }
  );
  console.log(`Made order from ${user1}`);

  // User 2 fills another order
  orderId = result.logs[0].args.id;
  await exchange.fillOrder(orderId, { from: user2 });
  console.log(`Filled order from ${user1}`);

  // Wait 1 second
  await wait(1);

  // User 1 makes final order
  result = await exchange.placeOrder(
    {
      contractAddress: ETHER_ADDRESS,
      amount: randEth(),
    },
    {
      contractAddress: guilToken.address,
      amount: randGuil(),
    },
    { from: user1 }
  );
  console.log(`Made order from ${user1}`);

  // User 2 fills final order
  orderId = result.logs[0].args.id;
  await exchange.fillOrder(orderId, { from: user2 });
  console.log(`Filled order from ${user1}`);

  // Wait 1 second
  await wait(1);

  //////////////////////
  // Seed Open Orders //
  //////////////////////

  // User 1 makes 10 orders
  for (let i = 1; i <= 10; i++) {
    result = await exchange.placeOrder(
      {
        contractAddress: ETHER_ADDRESS,
        amount: randEth(),
      },
      {
        contractAddress: guilToken.address,
        amount: randGuil(),
      },
      { from: user1 }
    );
    console.log(`Made order from ${user1}`);
    // Wait 1 second
    await wait(1);
  }

  // User 2 makes 10 orders
  for (let i = 1; i <= 10; i++) {
    result = await exchange.placeOrder(
      {
        contractAddress: guilToken.address,
        amount: randGuil(),
      },
      {
        contractAddress: ETHER_ADDRESS,
        amount: randEth(),
      },
      { from: user2 }
    );
    console.log(`Made order from ${user2}`);
    // Wait 1 second
    await wait(1);
  }
};
