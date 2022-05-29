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

> This script deploy `SushiToken` ERC20, `MiniChefV2` staking smart contract, mint Sushi tokens to `MiniChefV2`, transfer SushiToken ownership to MiniChefV2 and set SushiToken to be distributed per second. Access the source code of [SushiToken](https://mumbai.polygonscan.com/address/0xBf1FC7A09e585c9162B2573CCeA70aAba5257518#code) and [MiniChefV2](https://mumbai.polygonscan.com/address/0x78E2425090db8C673c9cc691C5aB4975E569b02d#code) 

To deploy MiniChefV2 you need to add this variable to `.env`:

```
MINICHEF_SUSHI_PER_SECOND=//amount of Sushi to be distributed per second
MINICHEF_SUSHI_AMOUNT_TO_MINT=//amount of Sushi to be minted to MinichefV2 contract
```

And execute this script:

```
$ npm run deploy-minichef
```

The addresses of both smart contracts will be show in the output:

```
[deploy-minichef] start
[deploy-minichef] Sushi ERC20 token contract deployed address:  0xBf1FC7A09e585c9162B2573CCeA70aAba5257518
[deploy-minichef] MinichefV2 contract deployed address:  0x78E2425090db8C673c9cc691C5aB4975E569b02d
[deploy-minichef] Sushi ERC20 token minted to MinichefV2 tx: 0x6e095c953a79343add86d9459db926948e9bb0a8f047a223d5f015b81287c1f3
[deploy-minichef] Sushi ERC20 token ownership transfered tx: 0xc15221e0fe5fb52d947805ab4395f657c965da97b1a328d54f65b34ba200f9a6
[deploy-minichef] MinichefV2 set sushi per second tx: 0xf77d731f35f3ca712bf05231ee45990aefff41a89f24c1f4c052277d7eab4f07
[deploy-minichef] done

```

#### Add Staking Pool to MiniChefV2

> This script deploy `MockRewarder`, mint reward tokens to `MockRewarder` and add new Pool to `MiniChefV2` smart contract. You can access the source code of [MockRewarder](https://mumbai.polygonscan.com/address/0xC16501A60Dfd9a1CCBbd5217FcBE19eb3d8c5d49#code) 

To Add Liquidity to Pool you need to add these variables to `.env`:

```
MINICHEF_ADDRESS=//address of the MiniChefV2 at choose network
LP_TOKEN_ADDRESS=//address of ERC20 to be staked
REWARDER_TOKEN_ADDRESS=//address of ERC20 to be rewarded
REWARDER_MULTIPLIER=//number used in reward calculation(see full contract)
REWARDER_AMOUNT_TO_MINT=//amount of tokens to be minted to reward contract
LP_ALOC_POINT=//amount of reward to distribute per block
```

And then run:

```
$ npm run add-pool
```

The hash of Add Pool transaction will be show in the output:

```
[add-pool] start
[add-pool] Rewarder contract deployed address:  0xC16501A60Dfd9a1CCBbd5217FcBE19eb3d8c5d49
[add-pool] 1000000000000000000 reward tokens minted to rewarder contract
[add-pool] create 0x82BD62C451a76cd7dD1Dd609b9db8826E69c73FF token pool 0 tx:  0x872740fc507a1d99d5e383be18e5b99541076efc2ff82c8e925088dc2b91df11
[add-pool] done
```

#### Deposit LP Token to MiniChefV2 Pool

> This script executes `deposit()` function in `MiniChefV2` smart contract, which deposit LP tokens to `MiniChefV2` smart contract pool. You can access the source code of [MiniChefV2](https://mumbai.polygonscan.com/address/0xC16501A60Dfd9a1CCBbd5217FcBE19eb3d8c5d49#code)

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
[deposit-pool] deposit 1000000000 of 0x82BD62C451a76cd7dD1Dd609b9db8826E69c73FF tokens to pool 0 tx:  0x0fe47174932d40d4853967c2a83c53353c653d6307f69198728e4b38ed1f13db
[deposit-pool] done
```

#### Withdraw LP Token and Rewards from MiniChefV2 Pool

> This script executes `withdrawAndHarvest()` function in `MiniChefV2` smart contract, which withdraw LP tokens from `MiniChefV2` pool and the reward tokens from Rewarder. You can access the source code of [MiniChefV2](https://mumbai.polygonscan.com/address/0xC16501A60Dfd9a1CCBbd5217FcBE19eb3d8c5d49#code)

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
[withdraw-pool] withdraw 1000000000 of 0x82BD62C451a76cd7dD1Dd609b9db8826E69c73FF tokens from pool 0 tx:  0x18c3a3e8e752f9d8ab24d9758c637b676eeb78acbeec68179caa64fe5a1c7306
[withdraw-pool] done
```

#### Update MiniChefV2 Pool

> This script update `MiniChefV2` smart contract pool. When update happens the amount of reward is updated. You can access the source code of [MiniChefV2](https://mumbai.polygonscan.com/address/0xC16501A60Dfd9a1CCBbd5217FcBE19eb3d8c5d49#code)

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
[update-pool] Pool 0 update tx:  0xdd5d82908e08051c2eebb73d8af289191699e2c364e6520aa6e06a45f8809bbb
[update-pool] done
```

#### Get MiniChefV2 Pool and User Info

> This script get `MiniChefV2` smart contract pool and user info. You can access the source code of [MiniChefV2](https://mumbai.polygonscan.com/address/0xC16501A60Dfd9a1CCBbd5217FcBE19eb3d8c5d49#code)

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
[info-pool] Pool 0 info:  {
  accSushiPerShare: '71000000',
  lastRewardBlock: '1653865278',
  allocPoint: '1000'
}
[info-pool] User Pool 0 info:  { amount: '1000000000', rewardDebt: '0' }
```

### Others

#### Deploy and mint ERC20

> If you need to create fresh ERC20 tokens for test run this script that create a new ERC20 token called `SCT`. See the source code [here](https://github.com/solid-world/solid-world-dao-contracts) and verified contract [here](https://mumbai.polygonscan.com/address/0x82BD62C451a76cd7dD1Dd609b9db8826E69c73FF#code)

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
[deploy-erc20] SCT ERC20 token contract deployed address:  0x82BD62C451a76cd7dD1Dd609b9db8826E69c73FF
[deploy-erc20] 1000000000000000000 SCT ERC20 tokens minted tx: 0x4c89bd89f1caed7d925fc8565bee85fdfadef4ada289fb629f85ccc4022209e3
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