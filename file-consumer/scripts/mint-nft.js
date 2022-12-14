require("dotenv").config()
const API_URL = process.env.API_URL
// const PUBLIC_KEY = process.env.PUBLIC_KEY;
// const PUBLIC_KEY = 'Ab40cF6c4770d8d8a0DbE697355F5a93f6A36Dd8';
// const PRIVATE_KEY = process.env.PRIVATE_KEY;
// const PRIVATE_KEY = 'ac34a1cd57b36031228b49af07f87d2064983ac8c787e49e20ab91efa816e2c0';

const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const { resolveProperties } = require("ethers/lib/utils")
const web3 = createAlchemyWeb3(API_URL)

const contract = require("../../artifacts/contracts/MyNFT.sol/MyNFT.json")
// update anytime a new contract is deployed
const contractAddress = '0x23e56D79353Ce167e928019e9B28fb1469b701aA';
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

async function mintNFT(tokenURI, PUBLIC_KEY, PRIVATE_KEY) {
    const nonce   = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); //get latest nonce
    const tokenId = await web3.eth.getTransactionCount(contractAddress, 'latest'); //get latest nonce

  //the transaction
    const tx = {
      'from': PUBLIC_KEY,
      'to': contractAddress,
      'nonce': nonce,
      'gas': 500000,
      'data': nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI()
    };

    let txHash = '';

    const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)
    return new Promise(function(resolve, reject) {
      signPromise
      .then((signedTx) => {
        web3.eth.sendSignedTransaction(
          signedTx.rawTransaction,
          function (err, hash) {
            if (!err) {
              resolve({ contract: contractAddress, nonce: tokenId, hash: hash });
              // console.log(tokenId);
            } else {
              console.log(
                "Something went wrong when submitting your transaction:",
                err
              )
            }
          }
        )
      })
      .catch((err) => {
        console.log(" Promise failed:", err)
      })
    })
}

module.exports = { mintNFT }