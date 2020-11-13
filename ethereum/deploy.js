const HDWalletProvider = require('truffle-hdwallet-provider');

const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');


const provider = new HDWalletProvider(
    process.env.METAMASK_MNEMONIC,
    'https://rinkeby.infura.io/v3/ad6c5b3aa2854ff2845f842c4e308077'
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('DEPLOYING WITH ACCOUNT: ', accounts[0]);
    const deployedContract = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({ data: "0x" + compiledFactory.evm.bytecode.object })
        .send({ gas: '1000000', from: accounts[0] });

    console.log("DEPLOYED CONTRACT ADDRESS: ", deployedContract.options.address)
};

deploy();