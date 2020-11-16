import web3 from './configWeb3';
import Campaign from './build/Campaign.json';

const getCampaignInstance = (address) => {

    return new web3.eth.Contract(Campaign.abi, address)
}

export default getCampaignInstance;