require('dotenv').config()

// Ethers and provider
const ethers = require('ethers')
const rpcUrl = process.env.NETWORK_RPC_URL
const provider = new ethers.providers.JsonRpcProvider(rpcUrl)

// Wallet
const password = process.env.ACCOUNT_PASSWORD
const accountFile = require('../account.json')

// ABI and bytecodes
const sushiFactoryAbi = require('../abi/sushifactory.abi.json')

// Script params
const sushiFactoryAddress = process.env.SUSHI_FACTORY_ADDRESS
const tokenAAddress = process.env.TOKEN_A_ADDRESS
const tokenBAddress = process.env.TOKEN_B_ADDRESS

runCreatePair()

async function runCreatePair () {
  try {
    console.log('[create-pair] start')

    if (!sushiFactoryAddress) {
      console.log('[create-pair] error: SUSHI_FACTORY_ADDRESS null')
      return
    }

    if (!tokenAAddress) {
      console.log('[create-pair] error: TOKEN_A_ADDRESS null')
      return
    }

    if (!tokenBAddress) {
      console.log('[create-pair] error: TOKEN_B_ADDRESS null')
      return
    }

    const walletJson = JSON.stringify(accountFile)
    const wallet = await ethers.Wallet.fromEncryptedJson(walletJson, password)
    const account = wallet.connect(provider)

    const sushiFactoryContract = new ethers.Contract(sushiFactoryAddress, sushiFactoryAbi, account)

    const createPair = await sushiFactoryContract.createPair(tokenAAddress, tokenBAddress)
    const createPairReceipt = await createPair.wait()
    console.log(`[create-pair] ${tokenAAddress} X ${tokenBAddress} pair created tx:`, createPairReceipt.transactionHash)

    console.log('[create-pair] done')
  } catch (error) {
    console.log('[create-pair] error: ', error.message)
  }
}
