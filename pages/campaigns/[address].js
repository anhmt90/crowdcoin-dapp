import React from 'react';
import { Card, Grid, Button } from 'semantic-ui-react';
import Link from 'next/link';


import Layout from '../../components/Layout';
import getCampaignInstance from '../../ethereum/campaign';
import web3 from '../../ethereum/configWeb3';
import ContributeForm from '../../components/ContributeForm';



export async function getServerSideProps({ query }) {
    const campaign = getCampaignInstance(query.address);
    const summary = await campaign.methods.getSummary().call();
    return {
        props: {
            address: query.address,
            minContribution: summary[0],
            balance: summary[1],
            requestCount: summary[2],
            backersCount: summary[3],
            manager: summary[4],
        }
    };
}

const CampaignDetail = (props) => {
    const {
        address,
        balance,
        manager,
        minContribution,
        requestCount,
        backersCount
    } = props;

    const renderCards = () => {

        const items = [
            {
                header: manager,
                meta: 'Address of Manager',
                description: 'The manger created this campaign and can create requests to withdraw money.',
                style: { overflowWrap: 'break-word' },

            },
            {
                header: minContribution,
                meta: 'Minimum Contribution (wei)',
                description: 'You must contribute at least this much wei to become a backer'
            },
            {
                header: requestCount,
                meta: 'Number of Requests',
                description: 'A request tries to withdraw money from the contract. Request must be approved by the majority of backers'
            },
            {
                header: backersCount,
                meta: 'Number of Backers',
                description: 'Number of people who have already donated to this campaign'
            },
            {
                header: `${web3.utils.fromWei(balance, 'ether')} ether`,
                meta: 'Campaign Balance (ether)',
                description: 'The balance is how much money this campaign has left to spend.'
            }

        ];

        return <Card.Group items={items} />;
    };
    return (
        <Layout>
            <h3>Campaign Details</h3>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={10}>
                        {renderCards()}
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <ContributeForm campaignAddress={address} />
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                    <Grid.Column>
                        <Link href={`/campaigns/${address}/requests`}>
                            <a>
                                <Button primary>View Requests</Button>
                            </a>
                        </Link>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Layout>
    );
};

export default CampaignDetail;