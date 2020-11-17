import React from 'react';
import { Button, Table } from 'semantic-ui-react';
import Link from 'next/link';

import Layout from '../../../../components/Layout';
import RequestRow from '../../../../components/RequestRow';
import getCampaignInstance from '../../../../ethereum/campaign';

export async function getServerSideProps({ query }) {
    const campaign = getCampaignInstance(query.address);
    const backersCount = await campaign.methods.backersCount().call()

    const requestCount = parseInt(await campaign.methods.getRequestsCount().call());
    console.log("REQ COUNT", requestCount, typeof (requestCount));
    const requests = await Promise.all(
        Array(requestCount)
            .fill()
            .map(async (element, i) => {
                const result = await campaign.methods.requests(i).call();
                return { ...result };
            })
    );

    console.log(requests);

    return {
        props: {
            address: query.address,
            requests,
            requestCount,
            backersCount 
        }
    };
}

const RequestIndex = ({ address, requests, requestCount, backersCount }) => {
    const { Header, Row, HeaderCell, Body } = Table;

    const renderRows = () => {
        return requests.map((request, index) => {
            return (
                <RequestRow
                    key={index}
                    id={index}
                    request={request}
                    address={address}
                    backersCount={backersCount}
                />
            );
        });
    };

    return (
        <Layout>
            <Link href={`/campaigns/${address}`}>
                <a><h4> Back </h4></a>
            </Link>
            <h3>Request List</h3>
            <Table>
                <Header>
                    <Row>
                        <HeaderCell>ID</HeaderCell>
                        <HeaderCell>Description</HeaderCell>
                        <HeaderCell>Amount (ether)</HeaderCell>
                        <HeaderCell>Recipient</HeaderCell>
                        <HeaderCell>Approval count</HeaderCell>
                        <HeaderCell textAlign="center">Approved</HeaderCell>
                        <HeaderCell textAlign="center">Finalize</HeaderCell>
                    </Row>
                </Header>
                <Body>
                    {renderRows()}
                </Body>
            </Table>
            <div style={{ float: "right" }}>Found {requestCount} requests</div>
            <Link href={`/campaigns/${address}/requests/new`}>
                <a>
                    <Button primary style={{ marginTop: 10 }}>Add Request</Button>
                </a>
            </Link>
        </Layout>
    );
};

export default RequestIndex;