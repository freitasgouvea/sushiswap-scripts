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

// Contracts Addresses
const minichefAddress = process.env.MINICHEF_ADDRESS

// Script params
const poolId = process.env.DEPOSIT_POOL_ID || 0

runUpdatePool()

async function runUpdatePool () {
  try {
    console.log('[update-pool] start')

    if (!minichefAddress) {
      console.log('[update-pool] error: MINICHEF_ADDRESS null')
      return
    }

    const walletJson = JSON.stringify(accountFile)
    const wallet = await ethers.Wallet.fromEncryptedJson(walletJson, password)
    const account = wallet.connect(provider)

    const minichefContract = new ethers.Contract(minichefAddress, minichefAbi, account)

    const updatePool = await minichefContract.updatePool(poolId)
    const updatePoolReceipt = await updatePool.wait()
    console.log(`[update-pool] Pool ${poolId} update tx: `, updatePoolReceipt.transactionHash)

    console.log('[update-pool] done')
  } catch (error) {
    console.log('[update-pool] error: ', error.message)
  }
}
