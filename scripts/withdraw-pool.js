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
const lpTokenAddress = process.env.LP_TOKEN_ADDRESS

// Script params
const poolId = process.env.WITHDRAW_POOL_ID || 0
const amount = process.env.WITHDRAW_POOL_AMOUNT || '1000000000'

runWithdrawPool()

async function runWithdrawPool () {
  try {
    console.log('[withdraw-pool] start')

    if (!minichefAddress) {
      console.log('[withdraw-pool] error: MINICHEF_ADDRESS null')
      return
    }

    if (!lpTokenAddress) {
      console.log('[withdraw-pool] error: LP_TOKEN_ADDRESS null')
      return
    }

    const walletJson = JSON.stringify(accountFile)
    const wallet = await ethers.Wallet.fromEncryptedJson(walletJson, password)
    const account = wallet.connect(provider)

    const minichefContract = new ethers.Contract(minichefAddress, minichefAbi, account)
    const withdrawPool = await minichefContract.withdrawAndHarvest(
      poolId,
      amount,
      wallet.address
    )
    const withdrawPoolReceipt = await withdrawPool.wait()
    console.log(`[withdraw-pool] withdraw ${amount} of ${lpTokenAddress} tokens from pool ${poolId} tx: `, withdrawPoolReceipt.transactionHash)

    console.log('[withdraw-pool] done')
  } catch (error) {
    console.log('[withdraw-pool] error: ', error.message)
  }
}
