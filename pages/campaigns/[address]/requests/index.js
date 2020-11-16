import React from 'react';
import { Button } from 'semantic-ui-react';
import Link from 'next/link';

import Layout from '../../../../components/Layout';

export async function getServerSideProps({ query }) {
    return {
        props: {
            address: query.address
        }
    };
}

const RequestIndex = ({ address }) => {
    return (
        <Layout>
            <h3>Request List</h3>
            <Link href={`/campaigns/${address}/requests/new`}>
                <a>
                    <Button primary>Add Request</Button>
                </a>
            </Link>
        </Layout>
    );
};

export default RequestIndex;