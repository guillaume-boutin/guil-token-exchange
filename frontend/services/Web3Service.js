import Web3 from "web3";
import ExchangeJson from "../../backend/abis/Exchange.json";

export class Web3Service {
  /** @private {Web3} */ web3 = null;

  /**
   * @returns {Promise<Web3|null>}
   */
  async loadWeb3() {
    if (this.web3) return this.web3;
    let web3;

    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      try {
        // Request account access if needed
        await window.ethereum.enable();
        this.web3 = web3;
        return this.web3;
      } catch (error) {
        console.log(error);
        // User denied account access...
        return null;
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      this.web3 = new Web3(window.web3.currentProvider);
      return this.web3;
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
  async loadAccount() {
    const [account] = await this.web3.eth.getAccounts();
    return account;
  }

  async loadExchangeContract() {
    try {
      const networkId = await this.web3.eth.net.getId();

      return new this.web3.eth.Contract(
        ExchangeJson.abi,
        ExchangeJson.networks[networkId].address
      );
    } catch (e) {}
  }
}
