require('dotenv').config()

// Ethers and provider
const ethers = require('ethers')
const rpcUrl = process.env.NETWORK_RPC_URL
const provider = new ethers.providers.JsonRpcProvider(rpcUrl)

// Wallet
const password = process.env.ACCOUNT_PASSWORD
const accountFile = require('../account.json')

// ABI and bytecodes
const sushiTokenAbi = require('../abi/sushitoken.abi.json')
const sushiTokenBytecode = require('../abi/sushitoken.bytecode.json')
const miniChiefAbi = require('../abi/minichiefv2.abi.json')
const miniChiefBytecode = require('../abi/minichiefv2.bytecode.json')

runDeployMiniChief()

async function runDeployMiniChief () {
  try {
    console.log('[deploy-minichief] start')

    const walletJson = JSON.stringify(accountFile)
    const wallet = await ethers.Wallet.fromEncryptedJson(walletJson, password)
    const account = wallet.connect(provider)

    const sushiTokenContract = new ethers.ContractFactory(sushiTokenAbi, sushiTokenBytecode, account)
    const sushiTokenContractDeployed = await sushiTokenContract.deploy()
    const sushiTokenAddress = sushiTokenContractDeployed.address
    console.log('[deploy-minichief] Sushi ERC20 token contract deployed address: ', sushiTokenAddress)

    const miniChiefContract = new ethers.ContractFactory(miniChiefAbi, miniChiefBytecode, account)
    const miniChiefContractDeployed = await miniChiefContract.deploy(sushiTokenAddress)
    const miniChiefAddress = miniChiefContractDeployed.address
    console.log('[deploy-minichief] Mini Chief V2 contract deployed address: ', miniChiefAddress)

    const transferSushiOwnership = await sushiTokenContractDeployed.transferOwnership(miniChiefAddress)
    const transferSushiOwnershipReceipt = await transferSushiOwnership.wait()
    console.log(`[deploy-minichief] Sushi ERC20 token ownership transfered tx: ${transferSushiOwnershipReceipt.transactionHash}`)

    console.log('[deploy-minichief] done')
  } catch (error) {
    console.log('[deploy-minichief] error: ', error.message)
  }
}
