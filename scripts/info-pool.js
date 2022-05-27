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
const poolId = process.env.INFO_POOL_ID || 0

runInfoPool()

async function runInfoPool () {
  try {
    if (!minichefAddress) {
      console.log('[info-pool] error: MINICHEF_ADDRESS null')
      return
    }

    const walletJson = JSON.stringify(accountFile)
    const wallet = await ethers.Wallet.fromEncryptedJson(walletJson, password)
    const account = wallet.connect(provider)

    const minichefContract = new ethers.Contract(minichefAddress, minichefAbi, account)

    const poolInfo = await minichefContract.poolInfo(0)
    console.log(
      `[info-pool] Pool ${poolId} info: `,
      {
        accSushiPerShare: poolInfo[0].toString(),
        lastRewardBlock: poolInfo[1].toString(),
        allocPoint: poolInfo[2].toString()
      }
    )

    const userInfo = await minichefContract.userInfo(poolId, wallet.address)
    console.log(
      `[info-pool] User Pool ${poolId} info: `,
      {
        amount: userInfo[0].toString(),
        rewardDebt: userInfo[1].toString()
      }
    )
  } catch (error) {
    console.log('[info-pool] error: ', error.message)
  }
}
