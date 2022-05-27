# Sushiswap NodeJs Scripts

This repository contains `nodejs/ethers` scripts to execute Sushiswap smart contracts tasks.

For more information about Sushiswap smart contracts and their addresses in each network take a look at the protocol page:

- [Sushiswap Docs](https://docs.sushi.com/)
- [Sushiswap Addresses](https://docs.sushi.com/docs/Developers/Deployment%20Addresses)

To access the smart contracts used by this repository:

- [Sushiswap Smart Contracts](https://github.com/freitasgouvea/sushiswap/tree/test)

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

* Create Sushiswap Pair
* Add Liquidity to Pair
* Deploy Sushi Token and MiniChefV2 smart contracts
* Add Staking Pool to MiniChefV2
* Deposit LP Token to MiniChefV2 Pool
* Withdraw LP Token and Rewards from MiniChefV2 Pool
* Update MiniChefV2 Pool
* Get MiniChefV2 Pool and User Info
* Deploy and Mint ERC20 tokens

### Sushiswap Liquidity Pool and Swap

#### Create Pair

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

#### Add Liquidity

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

And then run:

```
$ npm run add-liquidity
```

The hash of Add Liquidity transaction will be show in the output:

```
[add-liquidity] start
[add-liquidity] sushiswap spend token A approved
[add-liquidity] sushiswap spend token B approved
[add-liquidity] 0x6974a18d99BaDB190b73d3D8D1B7Dd955b718E7A X 0x3BC2e8BF8813d3ddA37C8774CFd9EC4e4878DAe5 add liquidity tx:  0xec58dc9f5b6841d78e692d172524a548b747dc7ee68ff8adb9ade58cd9628a13
[add-liquidity] done
```

### Sushiswap Staking and Reward

#### Deploy Sushi Token and MiniChefV2

> This script deploy `SushiToken` ERC20, `MiniChefV2` staking smart contract, transfer SushiToken ownership to MiniChefV2 and set SushiToken to be distributed per second. Access the source code of [SushiToken](https://mumbai.polygonscan.com/address/0xE5AB03080C57DA1C80719C43895929E165aF6919#code) and [MiniChefV2](https://mumbai.polygonscan.com/address/0x8937d3bcD72b9CE937762252a186Abc8552F34aa#code) 

To deploy MiniChefV2 you need to add this variable to `.env`:

```
MINICHEF_SUSHI_PER_SECOND=//amount of Sushi to be distributed per second
```

And execute this script:

```
$ npm run deploy-minichef
```

The addresses of both smart contracts will be show in the output:

```
[deploy-minichef] start
[deploy-minichef] Sushi ERC20 token contract deployed address:  0xE5AB03080C57DA1C80719C43895929E165aF6919
[deploy-minichef] Mini chef V2 contract deployed address:  0x8937d3bcD72b9CE937762252a186Abc8552F34aa
[deploy-minichef] Sushi ERC20 token ownership transfered tx: 0xddaba9026900d836fe567103be278cb9fc50c8c45523b4f48c199518d7fc8675
[deploy-minichef] Mini chef V2 set sushi per second tx: 0x8e3316e8862e4183297b4d85846838556bf48d0cde56f295b8586dc56c0a3cb4
[deploy-minichef] done
```

#### Add Staking Pool to MiniChefV2

> This script deploy `MockRewarder` and add new Pool to `MiniChefV2` smart contract. You can access the source code of [MockRewarder](https://mumbai.polygonscan.com/address/0x91257CF6BfFbBf30171DF2bEa04013c101A90Ab0#code) 

To Add Liquidity to Pool you need to add these variables to `.env`:

```
MINICHEF_ADDRESS=//address of the MiniChefV2 at choose network
LP_TOKEN_ADDRESS=//address of ERC20 to be staked
REWARDER_TOKEN_ADDRESS=//address of ERC20 to be rewarded
REWARDER_MULTIPLIER=//number used in reward calculation(see full contract)
LP_ALOC_POINT=//amount of reward to distribute per block
```

And then run:

```
$ npm run add-pool
```

The hash of Add Pool transaction will be show in the output:

```
[add-pool] start
[add-pool] Rewarder contract deployed address:  0x91257CF6BfFbBf30171DF2bEa04013c101A90Ab0
[add-pool] create 0x285D8Fb65ffeaD1De9992C9D45F4bf66D3a0BB87 token pool 0 tx:  0x5dbb4d66eaa24eb1807be6e837a70a5b1822cd5c1a17ee17958bfaea24ef1413
[add-pool] done
```

#### Deposit LP Token to MiniChefV2 Pool

> This script deposit LP tokens to `MiniChefV2` smart contract pool. You can access the source code of [MiniChefV2](https://mumbai.polygonscan.com/address/0x8937d3bcD72b9CE937762252a186Abc8552F34aa#code)

To deposit Liquidity Token to Pool you need to set these variables to `.env`:

```
MINICHEF_ADDRESS=//address of the MiniChefV2 at choose network
DEPOSIT_POOL_ID=//MiniChefV2 pool id 
DEPOSIT_POOL_AMOUNT=//amount of LP tokens to deposit 
```

And then run:

```
$ npm run deposit-pool
```

The hash of deposit transaction will be show in the output:

```
[deposit-pool] start
[deposit-pool] minichef spend LP token approved
[deposit-pool] deposit 1000000000 of 0x285D8Fb65ffeaD1De9992C9D45F4bf66D3a0BB87 tokens to pool 0 tx:  0x4864e9fdd1da84570aa81242d7fdae37a962f9f779ea0794dc2740875037e927
[deposit-pool] done
```

#### Withdraw LP Token and Rewards from MiniChefV2 Pool

> This script withdraw LP tokens from `MiniChefV2` smart contract pool. You can access the source code of [MiniChefV2](https://mumbai.polygonscan.com/address/0x8937d3bcD72b9CE937762252a186Abc8552F34aa#code)

To withdraw Liquidity Tokens from pool and recieve Reward Tokens you need to set these variables to `.env`:

```
MINICHEF_ADDRESS=//address of the MiniChefV2 at choose network
WITHDRAW_POOL_ID=//MiniChefV2 pool id 
WITHDRAW_POOL_AMOUNT=//amount of LP tokens to withdraw 
```

And then run:

```
$ npm run withdraw-pool
```

The hash of withdraw transaction will be show in the output:

```
[withdraw-pool] start
[withdraw-pool] withdraw 1000000000 of 0x285D8Fb65ffeaD1De9992C9D45F4bf66D3a0BB87 tokens from pool 0 tx:  0xaa02ae60802249fa69f100787c67dcf27bf794aed4a3e5f649a2184f8ef4b9f1
[withdraw-pool] done
```

#### Update MiniChefV2 Pool

> This script update `MiniChefV2` smart contract pool. When update happens the amount of reward is updated. You can access the source code of [MiniChefV2](https://mumbai.polygonscan.com/address/0x8937d3bcD72b9CE937762252a186Abc8552F34aa#code)

To update Pool you need to set these variables to `.env`:

```
MINICHEF_ADDRESS=//address of the MiniChefV2 at choose network
UPDATE_POOL_ID=//MiniChefV2 pool id 
```

And then run:

```
$ npm run update-pool
```

The hash of update transaction will be show in the output:

```
[update-pool] start
[update-pool] Pool 0 update tx:  0xd816ce55518b741cf1ffc83dc37270a3f2df14bfb10aeb94b0e659b82b5ad45e
[update-pool] done
```

#### Get MiniChefV2 Pool and User Info

> This script get `MiniChefV2` smart contract pool and user info. You can access the source code of [MiniChefV2](https://mumbai.polygonscan.com/address/0x8937d3bcD72b9CE937762252a186Abc8552F34aa#code)

To execute this script you need to set these variables to `.env`:

```
MINICHEF_ADDRESS=//address of the MiniChefV2 at choose network
INFO_POOL_ID=//MiniChefV2 pool id 
```

And then run:

```
$ npm run info-pool
```

The info will be show in the output:

```
[info-pool] Pool 0 info:  { accSushiPerShare: '140000000000000000000000', lastRewardBlock: '1653679863', allocPoint: '1000' }
[info-pool] User Pool 0 info:  { amount: '1000000000', rewardDebt: '5000' }
```

### Others

#### Deploy and mint ERC20

> If you need to create fresh ERC20 tokens for test run this script that create a new ERC20 token called `SCT`. See the source code [here](https://github.com/solid-world/solid-world-dao-contracts)

You can set the `AMOUNT_TO_MINT` to deployer wallet at `.env` file:

```
AMOUNT_TO_MINT="1000000000000000000000000"
```

And create ERC20 token:

```
$ npm run deploy-erc20
```

The address of ERC 20 token will be show in the output:

```
[deploy-erc20] start
[deploy-erc20] SCT ERC20 management contract deployed
[deploy-erc20] SCT ERC20 token contract deployed address:  0x285D8Fb65ffeaD1De9992C9D45F4bf66D3a0BB87
[deploy-erc20] 1000000000000000000 SCT ERC20 tokens minted
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