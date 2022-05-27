require('dotenv').config()

// Ethers and provider
const ethers = require('ethers')
const rpcUrl = process.env.NETWORK_RPC_URL
const provider = new ethers.providers.JsonRpcProvider(rpcUrl)

// Wallet
const password = process.env.ACCOUNT_PASSWORD
const accountFile = require('../account.json')

// ABI and bytecodes
const erc20Abi = require('../abi/scttoken.abi.json')
const sushiswapAbi = require('../abi/sushiswap.abi.json')

// Script params
const sushiswapAddress = process.env.SUSHI_SWAP_ADDRESS
const tokenAAddress = process.env.TOKEN_A_ADDRESS
const tokenBAddress = process.env.TOKEN_B_ADDRESS
const amountAddTokenA = process.env.ADD_AMOUNT_TOKEN_A || '1000000000000000'
const amountAddTokenB = process.env.ADD_AMOUNT_TOKEN_B || '1000000000000000'
const amountDesiredTokenA = process.env.ADD_AMOUNT_DESIRED_TOKEN_A || '1000000000000000'
const amountDesiredTokenB = process.env.ADD_AMOUNT_DESIRED_TOKEN_B || '1000000000000000'
const amountMinimunTokenA = process.env.ADD_AMOUNT_MINIMUM_TOKEN_A || '1000000000000000'
const amountMinimumTokenB = process.env.ADD_AMOUNT_MINIMUM_TOKEN_B || '1000000000000000'
const deadline = process.env.ADD_DEADLINE || Math.floor(Date.now() / 1000) + 2629743

runAddLiquidity()

async function runAddLiquidity () {
  try {
    console.log('[add-liquidity] start')

    if (!sushiswapAddress) {
      console.log('[add-liquidity] error: SUSHI_SWAP_ADDRESS null')
      return
    }

    if (!tokenAAddress) {
      console.log('[add-liquidity] error: TOKEN_A_ADDRESS null')
      return
    }

    if (!tokenBAddress) {
      console.log('[add-liquidity] error: TOKEN_B_ADDRESS null')
      return
    }

    const walletJson = JSON.stringify(accountFile)
    const wallet = await ethers.Wallet.fromEncryptedJson(walletJson, password)
    const account = wallet.connect(provider)

    const tokenAContract = new ethers.Contract(tokenAAddress, erc20Abi, account)
    const approveTokenA = await tokenAContract.approve(sushiswapAddress, amountAddTokenA)
    await approveTokenA.wait()
    console.log('[add-liquidity] sushiswap spend token A approved')

    const tokenBContract = new ethers.Contract(tokenBAddress, erc20Abi, account)
    const approveTokenB = await tokenBContract.approve(sushiswapAddress, amountAddTokenB)
    await approveTokenB.wait()
    console.log('[add-liquidity] sushiswap spend token B approved')

    const sushiswapContract = new ethers.Contract(sushiswapAddress, sushiswapAbi, account)
    const addLiquidity = await sushiswapContract.addLiquidity(
      tokenAAddress,
      tokenBAddress,
      amountDesiredTokenA,
      amountDesiredTokenB,
      amountMinimunTokenA,
      amountMinimumTokenB,
      wallet.address,
      deadline
    )
    const addLiquidityReceipt = await addLiquidity.wait()
    console.log(`[add-liquidity] ${tokenAAddress} X ${tokenBAddress} add liquidity tx: `, addLiquidityReceipt.transactionHash)

    console.log('[add-liquidity] done')
  } catch (error) {
    console.log('[add-liquidity] error: ', error.message)
  }
}
