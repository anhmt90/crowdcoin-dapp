import React, { useEffect } from 'react';
import { Card, Button } from 'semantic-ui-react';
// import 'semantic-ui-css/semantic.min.css'

import factory from '../ethereum/factory';
import Layout from '../components/Layout'



/**
 * useEffect won't be executed on server-side rendering (JS on browser disabled)
 * --> no fetching data with Next.js
 * ==> make use of getServerSideProps()
*/
export async function getServerSideProps() {
    /**
     * Fetch data from external API
     */
    const campaigns = await factory.methods.getDeployedCampaigns().call();

    /**
     * Pass data to the page via props
     */
    return { props: { campaigns } };
}

const CampaignIndex = ({ campaigns }) => {

    const renderCampaigns = () => {
        const items = campaigns.map(address => {
            return {
                header: address,
                description: <a>View Campaign</a>,
                fluid: true
            };
        });

        return <Card.Group items={items} />;
    };

    return (
        <Layout>
            <h3>Open Campaigns</h3>
            <Button 
                floated="right"
                content="Create Campaign"
                icon="add circle"
                primary
            />
            {renderCampaigns()}
        </Layout>
    );

};

export default CampaignIndex;