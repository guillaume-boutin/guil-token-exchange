import Web3 from "web3";

export class Web3Service {
  /**
   * @private
   * @property {Web3}
   */
  web3 = null;

  /**
   * @returns {Promise<Web3|null>}
   */
  async get() {
    if (this.web3 !== null) return this.web3;

    this.web3 = await this.loadWeb3();

    return this.web3;
  }

  /**
   * @returns {Promise<Web3|null>}
   */
  async loadWeb3() {
    console.log("loadWeb3...");
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
}
