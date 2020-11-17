import React from 'react';
import { Card, Button } from 'semantic-ui-react';
import Link from 'next/link';

import factory from '../ethereum/factory';
import Layout from '../components/Layout';



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
                description: (
                    <Link href={`/campaigns/${address}`}>
                        <a>View Campaign</a>
                    </Link>
                ),
                fluid: true
            };
        });

        return <Card.Group items={items} />;
    };

    return (
        <Layout>
            <h3>Campaigns on Rinkeby Testnet</h3>

            <Link href="/campaigns/new">
                <a className="item">
                    <Button
                        floated="right"
                        content="Create Campaign"
                        icon="add circle"
                        primary
                    />
                </a>
            </Link>


            {renderCampaigns()}
        </Layout>
    );

};

export default CampaignIndex;