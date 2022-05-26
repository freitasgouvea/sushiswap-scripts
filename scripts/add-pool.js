require('dotenv').config()

// Ethers and provider
const ethers = require('ethers')
const rpcUrl = process.env.NETWORK_RPC_URL
const provider = new ethers.providers.JsonRpcProvider(rpcUrl)

// Wallet
const password = process.env.ACCOUNT_PASSWORD
const accountFile = require('../account.json')

// ABI and bytecodes
const miniChiefAbi = require('../abi/minichiefv2.abi.json')
const rewarderAbi = require('../abi/rewarder.abi.json')
const rewarderBytecode = require('../abi/rewarder.bytecode.json')

// Script params
const miniChiefAddress = process.env.MINICHIEF_ADDRESS
const rewarderTokenAddress = process.env.REWARDER_TOKEN_ADDRESS
const rewarderMultiplier = process.env.REWARDER_MULTIPLIER || 1
const lpTokenAddress = process.env.LP_TOKEN_ADDRESS
let rewarderContractAddress
let alocPoint

runAddPool()

async function runAddPool () {
  try {
    console.log('[add-pool] start')

    if (!miniChiefAddress) {
      console.log('[add-pool] error: MINICHIEF_ADDRESS null')
      return
    }

    if (!rewarderTokenAddress) {
      console.log('[add-pool] error: REWARDER_TOKEN_ADDRESS null')
      return
    }

    if (!lpTokenAddress) {
      console.log('[add-pool] error: LP_TOKEN_ADDRESS null')
      return
    }

    const walletJson = JSON.stringify(accountFile)
    const wallet = await ethers.Wallet.fromEncryptedJson(walletJson, password)
    const account = wallet.connect(provider)

    const rewarderContract = new ethers.ContractFactory(rewarderAbi, rewarderBytecode, account)
    const rewarderContractDeployed = await rewarderContract.deploy(
      rewarderMultiplier,
      rewarderTokenAddress,
      miniChiefAddress
    )
    rewarderContractAddress = rewarderContractDeployed.address
    console.log('[add-pool] Rewarder contract deployed address: ', rewarderContractAddress)

    const miniChiefContract = new ethers.Contract(miniChiefAddress, miniChiefAbi, account)
    alocPoint = await miniChiefContract.totalAllocPoint() + 1
    const addPool = await miniChiefContract.add(
      alocPoint,
      lpTokenAddress,
      rewarderContractAddress
    )
    const addPoolReceipt = await addPool.wait()
    console.log(`[add-pool] add ${lpTokenAddress} token pool tx: `, addPoolReceipt.transactionHash)

    console.log('[add-pool] done')
  } catch (error) {
    console.log('[add-pool] error: ', error.message)
  }
}
