import Web3 from "web3";
import ExchangeJson from "../../backend/abis/Exchange.json";
import GuilTokenJson from "../../backend/abis/GuilToken.json";

export class Web3Service {
  /**
   * @returns {Promise<Web3|null>}
   */
  async getWeb3() {
    let web3;

    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      try {
        // Request account access if needed
        await window.ethereum.enable();
        return web3;
      } catch (error) {
        console.log(error);
        // User denied account access...
        return null;
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      return new Web3(window.web3.currentProvider);
    }
    // Non-dapp browsers...
    else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
      return null;
    }
  }

  /**
   * @return {Promise<string|null>}
   */
  async getAccount(web3) {
    const [account] = await web3.eth.getAccounts();
    return account;
  }

  /**
   * @param {Web3} web3
   */
  async getExchangeContract(web3) {
    try {
      const networkId = await web3.eth.net.getId();

      return new web3.eth.Contract(
        ExchangeJson.abi,
        ExchangeJson.networks[networkId].address
      );
    } catch (e) {}
  }

  /**
   * @param {Web3} web3
   */
  async getGuilTokenContract(web3) {
    try {
      const networkId = await web3.eth.net.getId();

      return new web3.eth.Contract(
        GuilTokenJson.abi,
        GuilTokenJson.networks[networkId].address
      );
    } catch (e) {}
  }
}
