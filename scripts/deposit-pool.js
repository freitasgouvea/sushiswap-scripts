require('dotenv').config()

// Ethers and provider
const ethers = require('ethers')
const rpcUrl = process.env.NETWORK_RPC_URL
const provider = new ethers.providers.JsonRpcProvider(rpcUrl)

// Wallet
const password = process.env.ACCOUNT_PASSWORD
const accountFile = require('../account.json')

// ABI and bytecodes
const sctTokenAbi = require('../abi/scttoken.abi.json')
const minichefAbi = require('../abi/minichefv2.abi.json')

// Contracts Addresses
const minichefAddress = process.env.MINICHEF_ADDRESS
const lpTokenAddress = process.env.LP_TOKEN_ADDRESS

// Script params
const poolId = process.env.DEPOSIT_POOL_ID || 0
const amount = process.env.DEPOSIT_POOL_AMOUNT || '1000000000'

runAddPool()

async function runAddPool () {
  try {
    console.log('[deposit-pool] start')

    if (!minichefAddress) {
      console.log('[deposit-pool] error: MINICHEF_ADDRESS null')
      return
    }

    if (!lpTokenAddress) {
      console.log('[deposit-pool] error: LP_TOKEN_ADDRESS null')
      return
    }

    const walletJson = JSON.stringify(accountFile)
    const wallet = await ethers.Wallet.fromEncryptedJson(walletJson, password)
    const account = wallet.connect(provider)

    const lpTokenContract = new ethers.Contract(lpTokenAddress, sctTokenAbi, account)
    const approveLpToken = await lpTokenContract.approve(minichefAddress, amount)
    await approveLpToken.wait()
    console.log('[deposit-pool] minichef spend LP token approved')

    const minichefContract = new ethers.Contract(minichefAddress, minichefAbi, account)
    const depositPool = await minichefContract.deposit(
      poolId,
      amount,
      wallet.address
    )
    const depositPoolReceipt = await depositPool.wait()
    console.log(`[deposit-pool] deposit ${amount} of ${lpTokenAddress} tokens to pool ${poolId} tx: `, depositPoolReceipt.transactionHash)

    console.log('[deposit-pool] done')
  } catch (error) {
    console.log('[deposit-pool] error: ', error.message)
  }
}
