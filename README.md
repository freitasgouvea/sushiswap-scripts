# Sushiswap NodeJs Scripts

This repository contains `nodejs/ethers` scripts to execute Sushiswap smart contracts tasks.

For more information about sushiswap smart contracts and their addresses in each network take a look at the protocol page:

- [Sushiswap Docs](https://docs.sushi.com/)
- [Sushiswap Addresses](https://docs.sushi.com/docs/Developers/Deployment%20Addresses)

## How to use this repository

Install the project dependencies:

```
$ npm install
```

Update JSON wallet file with your JSON generated wallet file in `./account.json` file and save your password.

Create `.env` file and set the RPC URL of Ethereum/Polygon provider in `NETWORK_RPC_URL` and put the password of your JSON generated wallet file in `ACCOUNT_PASSWORD`.

For example:

```
NETWORK_RPC_URL='https://rpc-mumbai.matic.today'
ACCOUNT_PASSWORD='password'
```

You can see all avaiable `.env` variables used for execute the scripts at `.env.example` file.

## Scripts Avaiable

> Before execute these scripts do not forget to add funds for your wallet.

- Create Sushiswap Pair
- Add Liquidity to Pair
- Deploy and Mint ERC20 tokens


### Create Pair

> This script create a Liquidity Pool of two ERC20 (token A and token B) executing `createPair()` function in `SushiV2Factory` smart contract. You can access the full code [here](https://mumbai.polygonscan.com/address/0xc35DADB65012eC5796536bD9864eD8773aBc74C4#code)

To create a pair of Liquidity Pool ERC20 tokens you need to add these variables to `.env`:

```
SUSHI_FACTORY_ADDRESS=//address of the SushiV2Factory at choose network
TOKEN_A_ADDRESS=//address of ERC20 token A
TOKEN_B_ADDRESS=//address of ERC20 token B
```

And run:

```
$ npm run create-pair
```

The hash of Create Pair transaction will be show in the output:

```
[create-pair] start
[create-pair] 0x6F9b800B5DD3d4e348776059Bb7Af850d316bDd5 X 0x3E0071C248EfC3112B0E979449D19603074FAc08 pair created tx: 0x0ccac77dfc5bc6a6ef1c23296e682c6c490908e709aa85e6e67aec47212014b1
[create-pair] done
```

### Add Liquidity

> This script add liquidity to Pool of two ERC20 (token A and token B) executing `addLiquidity()` function in `SushiSwapRouter` smart contract. You can access the full code [here](https://mumbai.polygonscan.com/address/0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506#code) 

To Add Liquidity to Pool of ERC20 tokens you need to add these variables to `.env`:

```
SUSHI_SWAP_ADDRESS=//address of the SushiSwapRouter at choose network
TOKEN_A_ADDRESS=//address of ERC20 token A
TOKEN_B_ADDRESS=//address of ERC20 token B
AMOUNT_ADD_TOKEN_A=1000000000000000000000000
AMOUNT_ADD_TOKEN_B=1000000000000000000000000
ADD_AMOUNT_DESIRED_TOKEN_A=1000000000000000000000000
ADD_AMOUNT_DESIRED_TOKEN_B=1000000000000000000000000
ADD_AMOUNT_MINIMUM_TOKEN_A=1000000000000000000000000
ADD_AMOUNT_MINIMUM_TOKEN_B=1000000000000000000000000
ADD_LIQUIDITY_DEADLINE=//timestamp of deadline of liquidity supply in seconds
```

The hash of Add Liquidity transaction will be show in the output:

```
[add-liquidity] start
[add-liquidity] sushiswap spend token A approved
[add-liquidity] sushiswap spend token B approved
[add-liquidity] 0x6974a18d99BaDB190b73d3D8D1B7Dd955b718E7A X 0x3BC2e8BF8813d3ddA37C8774CFd9EC4e4878DAe5 add liquidity tx:  0xec58dc9f5b6841d78e692d172524a548b747dc7ee68ff8adb9ade58cd9628a13
[add-liquidity] done

```

### Deploy and mint ERC20

> If you need to create fresh ERC20 tokens for test run this script that create a new ERC20 token called `SCT`. See source code [here](https://github.com/solid-world/solid-world-dao-contracts)

You can set the `AMOUNT_TO_MINT` to deployer wallet at `.env` file:

```
AMOUNT_TO_MINT=1000000000000000000000000
```

And create ERC20 token:

```
$ npm run deploy-erc20
```

The address of ERC 20 token will be show in the output:

```
[deploy-erc20] start
[deploy-erc20] SCT ERC20 management contract deployed
[deploy-erc20] SCT ERC20 token contract deployed address:  0x6F9b800B5DD3d4e348776059Bb7Af850d316bDd5
[deploy-erc20] 1000000000000000000000000 SCT ERC20 tokens minted
[deploy-erc20] done
```


## More Info

- [Create Ethereum JSON wallet file](https://help.myetherwallet.com/en/articles/5979837-how-to-create-an-ethereum-wallet-with-mew-web)
- [Ethereum Mainnet RPC URLs](https://chainlist.org/chain/1)
- [Ethereum Rinkeby Testnet RPC URLs](https://chainlist.org/chain/4)
- [Polygon Mainnet RPC URLs](https://chainlist.org/chain/137)
- [Polygon Mumbai Testnet RPC URLs](https://chainlist.org/chain/80001)
- [Ethers Project](https://docs.ethers.io/v5/)
- [Uniswap V2 Docs](https://docs.uniswap.org/protocol/V2/introduction)