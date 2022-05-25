require('dotenv').config()

// Ethers and provider
const ethers = require('ethers')
const rpcUrl = process.env.NETWORK_RPC_URL
const provider = new ethers.providers.JsonRpcProvider(rpcUrl)

// Wallet
const password = process.env.ACCOUNT_PASSWORD
const accountFile = require('../account.json')

// ABI and bytecodes
const solidDaoManagementAbi = require('../abi/soliddaomanagement.abi.json')
const solidDaoManagementBytecode = require('../abi/soliddaomanagement.bytecode.json')
const sctTokenAbi = require('../abi/scttoken.abi.json')
const sctTokenBytecode = require('../abi/scttoken.bytecode.json')

// Script params
const amountToMint = process.env.AMOUNT_TO_MINT || 1000000000000000

runDeployErc20()

async function runDeployErc20 () {
  try {
    console.log('[deploy-erc20] start')

    const walletJson = JSON.stringify(accountFile)
    const wallet = await ethers.Wallet.fromEncryptedJson(walletJson, password)
    const account = wallet.connect(provider)
    const walletAddress = wallet.address

    const solidDaoManagementContract = new ethers.ContractFactory(solidDaoManagementAbi, solidDaoManagementBytecode, account)
    const solidDaoManagementContractDeployed = await solidDaoManagementContract.deploy(walletAddress, walletAddress, walletAddress, walletAddress)
    const solidDaoManagementAddress = solidDaoManagementContractDeployed.address
    console.log('[deploy-erc20] SCT ERC20 management contract deployed')

    const sctTokenContract = new ethers.ContractFactory(sctTokenAbi, sctTokenBytecode, account)
    const sctTokenContractDeployed = await sctTokenContract.deploy(solidDaoManagementAddress)
    console.log('[deploy-erc20] SCT ERC20 token contract deployed address: ', sctTokenContractDeployed.address)

    const mintSctERC20 = await sctTokenContractDeployed.mint(wallet.address, amountToMint)
    await mintSctERC20.wait()
    console.log('[deploy-erc20] SCT ERC20 token minted')

    console.log('[deploy-erc20] done')
  } catch (error) {
    console.log('[deploy-erc20] error: ', error.message)
  }
}
