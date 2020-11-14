import React, { useState } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import { useRouter } from 'next/router';
import Link from 'next/link';


import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/configWeb3';


const CampaignNew = () => {
    const router = useRouter()

    const [minContribution, setMinContribution] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = async (event) => {
        event.preventDefault();

        setErrorMsg('')
        setLoading(true);

        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods.createCampaign(minContribution)
                .send({
                    from: accounts[0]
                    /**
                     * gas amount is automatically calculated by Metamask when running in the browser
                     * --> unlike in unit tests, no need to specify it here 
                     */
                });
            
            router.push('/');
        } catch (err) {
            setErrorMsg(err.message);
        }

        setLoading(false);
    };

    return (
        <Layout>
            <h3>Create a new Campaign</h3>
            <Form onSubmit={onSubmit} error={!!errorMsg}>
                <Form.Field>
                    <label>Minimum Contribution</label>
                    <Input
                        label="wei"
                        labelPosition="right"
                        value={minContribution}
                        onChange={event => setMinContribution(event.target.value)}
                    />
                </Form.Field>
                <Message error>
                    <Message.Header>Unable to create new Campaign!</Message.Header>
                    <p>{errorMsg}</p>
                </Message>
                <Button loading={loading} primary>Create</Button>
            </Form>
        </Layout>
    );
};

export default CampaignNew;