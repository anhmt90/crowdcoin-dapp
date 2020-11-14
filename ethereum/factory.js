import web3 from './configWeb3';
import CampaignFactory from './build/CampaignFactory.json';


const instance = new web3.eth.Contract(
    CampaignFactory.abi,
    process.env.NEXT_PUBLIC_DEPLOYED_CAMPAIGN_FACTORY_ADDRESS
);


export default instance;