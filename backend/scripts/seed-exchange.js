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

const handle = async () => {
  // Fetch accounts from wallet - these are unlocked
  const accounts = await web3.eth.getAccounts();

  // Fetch the deployed token
  const guilToken = await GuilToken.deployed();
  console.log("Token fetched", guilToken.address);

  // Fetch the deployed exchange
  const exchange = await Exchange.deployed();
  console.log("Exchange fetched", exchange.address);

  // Give tokens to account[1]
  const sender = accounts[0];
  const receiver = accounts[1];
  let amount = web3.utils.toWei("10000", "ether"); // 10,000 tokens

  await guilToken.transfer(receiver, amount, { from: sender });
  console.log(`Transferred ${amount} tokens from ${sender} to ${receiver}`);

  // Set up exchange users
  const [user1, user2] = accounts;

  // User 1 Deposits Ether
  amount = 1;
  await exchange.depositEther({ from: user1, value: toWei(amount) });
  console.log(`Deposited ${amount} Ether from ${user1}`);

  // User 2 Approves Tokens
  amount = 10000;
  await guilToken.approve(exchange.address, toWei(amount), { from: user2 });
  console.log(`Approved ${amount} tokens from ${user2}`);

  // User 2 Deposits Tokens
  await exchange.deposit(
    {
      contractAddress: guilToken.address,
      amount: toWei(amount),
    },
    {
      from: user2,
    }
  );
  console.log(`Deposited ${amount} tokens from ${user2}`);

  ////////////////////////////
  // Seed a Cancelled Order //
  ////////////////////////////

  // User 1 makes order demanding for guilTokens
  let result, orderId;
  result = await exchange.placeOrder(
    {
      contractAddress: ETHER_ADDRESS,
      amount: toWei(0.1),
    },
    {
      contractAddress: guilToken.address,
      amount: toWei(100),
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
      amount: toWei(0.1),
    },
    {
      contractAddress: guilToken.address,
      amount: toWei(100),
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
      amount: toWei(0.01),
    },
    {
      contractAddress: guilToken.address,
      amount: toWei(50),
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
      amount: toWei(0.15),
    },
    {
      contractAddress: guilToken.address,
      amount: toWei(200),
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
        amount: toWei(0.01),
      },
      {
        contractAddress: guilToken.address,
        amount: toWei(10 * i),
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
        amount: toWei(10 * i),
      },
      {
        contractAddress: ETHER_ADDRESS,
        amount: toWei(0.01),
      },
      { from: user2 }
    );
    console.log(`Made order from ${user2}`);
    // Wait 1 second
    await wait(1);
  }
};
