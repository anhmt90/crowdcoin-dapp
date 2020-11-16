import React, { useState } from 'react';
import { Form, Button, Message, Input } from 'semantic-ui-react';
import { useRouter } from 'next/router';
import Link from 'next/link';



import Layout from '../../../../components/Layout';
import web3 from '../../../../ethereum/configWeb3';
import getCampaignInstance from '../../../../ethereum/campaign';


export async function getServerSideProps({ query }) {

    return {
        props: {
            address: query.address
        }
    };
}


const RequestNew = ({ address }) => {
    const router = useRouter();

    const [value, setValue] = useState('');
    const [description, setDescription] = useState('');
    const [recipient, setRecipient] = useState('');

    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setErrorMsg('');
        const campaign = getCampaignInstance(address);
        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.createRequest(
                description,
                web3.utils.toWei(value, 'ether'),
                recipient
            ).send({ from: accounts[0] });

            router.push(`/campaigns/${address}`)
        } catch (err) {
            setErrorMsg(err.message);
        }
        setLoading(false);
    };

    return (
        <Layout>
            <Link href={`/campaigns/${address}/requests`}>
                <a><h4> Back </h4></a>
            </Link>
            <h3>Create new Spending Request</h3>
            <Form onSubmit={onSubmit} error={!!errorMsg}>
                <Form.Field>
                    <label>Description</label>
                    <Input
                        value={description}
                        onChange={event => setDescription(event.target.value)}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Value (ether)</label>
                    <Input
                        value={value}
                        onChange={event => setValue(event.target.value)}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Recipient</label>
                    <Input
                        value={recipient}
                        onChange={event => setRecipient(event.target.value)}
                    />
                </Form.Field>
                <Message error>
                    <Message.Header>Failed to create new Spending Request!</Message.Header>
                    <p>{errorMsg}</p>
                </Message>
                <Button primary loading={loading}>Create</Button>
            </Form>
        </Layout>
    );
};
export default RequestNew;