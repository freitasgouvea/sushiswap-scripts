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
const miniChefAbi = require('../abi/minichefv2.abi.json')
const miniChefBytecode = require('../abi/minichefv2.bytecode.json')

//
const sushiPerSeconds = process.env.MINICHEF_SUSHI_PER_SECOND || '1000000000000000000'

runDeployMiniChef()

async function runDeployMiniChef () {
  try {
    console.log('[deploy-minichef] start')

    const walletJson = JSON.stringify(accountFile)
    const wallet = await ethers.Wallet.fromEncryptedJson(walletJson, password)
    const account = wallet.connect(provider)

    const sushiTokenContract = new ethers.ContractFactory(sushiTokenAbi, sushiTokenBytecode, account)
    const sushiTokenContractDeployed = await sushiTokenContract.deploy()
    const sushiTokenAddress = sushiTokenContractDeployed.address
    console.log('[deploy-minichef] Sushi ERC20 token contract deployed address: ', sushiTokenAddress)

    const miniChefContract = new ethers.ContractFactory(miniChefAbi, miniChefBytecode, account)
    const miniChefContractDeployed = await miniChefContract.deploy(sushiTokenAddress)
    const miniChefAddress = miniChefContractDeployed.address
    console.log('[deploy-minichef] Mini chef V2 contract deployed address: ', miniChefAddress)

    const transferSushiOwnership = await sushiTokenContractDeployed.transferOwnership(miniChefAddress)
    const transferSushiOwnershipReceipt = await transferSushiOwnership.wait()
    console.log(`[deploy-minichef] Sushi ERC20 token ownership transfered tx: ${transferSushiOwnershipReceipt.transactionHash}`)

    const setSushiPerSecond = await miniChefContractDeployed.setSushiPerSecond(sushiPerSeconds)
    const setSushiPerSecondReceipt = await setSushiPerSecond.wait()
    console.log(`[deploy-minichef] Mini chef V2 set sushi per second tx: ${setSushiPerSecondReceipt.transactionHash}`)

    console.log('[deploy-minichef] done')
  } catch (error) {
    console.log('[deploy-minichef] error: ', error.message)
  }
}
