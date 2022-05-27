require('dotenv').config()

// Ethers and provider
const ethers = require('ethers')
const rpcUrl = process.env.NETWORK_RPC_URL
const provider = new ethers.providers.JsonRpcProvider(rpcUrl)

// Wallet
const password = process.env.ACCOUNT_PASSWORD
const accountFile = require('../account.json')

// ABI and bytecodes
const minichefAbi = require('../abi/minichefv2.abi.json')
const rewarderAbi = require('../abi/rewarder.abi.json')
const rewarderBytecode = require('../abi/rewarder.bytecode.json')

// Script params
const minichefAddress = process.env.MINICHEF_ADDRESS
const rewarderTokenAddress = process.env.REWARDER_TOKEN_ADDRESS
const rewarderMultiplier = process.env.REWARDER_MULTIPLIER
const lpTokenAddress = process.env.LP_TOKEN_ADDRESS
const alocPoint = process.env.LP_ALOC_POINT
let rewarderContractAddress

runAddPool()

async function runAddPool () {
  try {
    console.log('[add-pool] start')

    if (!minichefAddress) {
      console.log('[add-pool] error: MINICHEF_ADDRESS null')
      return
    }

    if (!rewarderTokenAddress) {
      console.log('[add-pool] error: REWARDER_TOKEN_ADDRESS null')
      return
    }

    if (!rewarderMultiplier) {
      console.log('[add-pool] error: REWARDER_MULTIPLIER null')
      return
    }

    if (!lpTokenAddress) {
      console.log('[add-pool] error: LP_TOKEN_ADDRESS null')
      return
    }

    if (!alocPoint) {
      console.log('[add-pool] error: LP_ALOC_POINT null')
      return
    }

    const walletJson = JSON.stringify(accountFile)
    const wallet = await ethers.Wallet.fromEncryptedJson(walletJson, password)
    const account = wallet.connect(provider)

    const rewarderContract = new ethers.ContractFactory(rewarderAbi, rewarderBytecode, account)
    const rewarderContractDeployed = await rewarderContract.deploy(
      rewarderMultiplier,
      rewarderTokenAddress,
      minichefAddress
    )
    rewarderContractAddress = rewarderContractDeployed.address
    console.log('[add-pool] Rewarder contract deployed address: ', rewarderContractAddress)

    const minichefContract = new ethers.Contract(minichefAddress, minichefAbi, account)
    const poolLength = await minichefContract.poolLength()
    const poolId = poolLength - 1
    const addPool = await minichefContract.add(
      alocPoint,
      lpTokenAddress,
      rewarderContractAddress
    )
    const addPoolReceipt = await addPool.wait()
    console.log(`[add-pool] create ${lpTokenAddress} token pool ${poolId} tx: `, addPoolReceipt.transactionHash)

    console.log('[add-pool] done')
  } catch (error) {
    console.log('[add-pool] error: ', error.message)
  }
}
