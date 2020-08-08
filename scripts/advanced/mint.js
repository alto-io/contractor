require("dotenv").config();

const deployInfo = require('../../temp_metadata/deployinfo.json');

const HDWalletProvider = require("truffle-hdwallet-provider")
const web3 = require('web3')
const INFURA_KEY = process.env.INFURA_API_KEY
const FACTORY_CONTRACT_ADDRESS = deployInfo.FactoryAddress
const OWNER_ADDRESS = deployInfo.ownerAddress
const NETWORK = deployInfo.network


let MNEMONIC; 
let RPC_URL;

if (NETWORK == 'ganache')
{
    MNEMONIC = process.env.GANACHE_MNEMONIC
    RPC_URL = "http://localhost:7545/";
}

else
{
    MNEMONIC = process.env.TESTNET_MNEMONIC
    RPC_URL = `https://${NETWORK}.infura.io/v3/${INFURA_KEY}`;
}

if (!MNEMONIC || !INFURA_KEY || !OWNER_ADDRESS || !NETWORK) {
    console.error("Please set a mnemonic, infura key, owner, network, and contract address.")
    return
}

const FACTORY_ABI = [
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_optionId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_toAddress",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "open",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "address",
                "name": "_toAddress",
                "type": "address"
            },
        ],
        "name": "contractorTestMint",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }   
]

/**
 * For now, this script just opens a lootbox.
 */
async function main() {
    const provider = new HDWalletProvider(MNEMONIC, RPC_URL);
    const web3Instance = new web3(provider);

    if (!FACTORY_CONTRACT_ADDRESS) {
        console.error("Please set an NFT contract address.")
        return
    }

    const factoryContract = new web3Instance.eth.Contract(FACTORY_ABI, FACTORY_CONTRACT_ADDRESS, { gasLimit: "1000000" })

    // const result = await factoryContract.methods.open(0, OWNER_ADDRESS, 1).send({ from: OWNER_ADDRESS });

    const result = await factoryContract.methods.contractorTestMint(OWNER_ADDRESS).send({ from: OWNER_ADDRESS });
    console.log("Created. Transaction: " + result.transactionHash)
}

main()
