import React, { useState } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import { useRouter } from 'next/router';

import getCampaignInstance from "../ethereum/campaign";
import web3 from '../ethereum/configWeb3';

const ContributeForm = ({ campaignAddress }) => {
    const router = useRouter();

    const [value, setValue] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setErrorMsg('');

        const campaign = getCampaignInstance(campaignAddress);



        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(value, 'ether')
            });

            router.replace(`/campaigns/${campaignAddress}`);
        } catch (err) {
            setErrorMsg(err.message);
        }

        setLoading(false);
        setValue('');
    };

    return (
        <Form onSubmit={onSubmit} error={!!errorMsg}>
            <Form.Field>
                <label>Amount to Contribute</label>
                <Input
                    value={value}
                    onChange={event => setValue(event.target.value)}
                    label="ether"
                    labelPosition="right"
                />
            </Form.Field>
            <Message error>
                <Message.Header>Fail to make contribution!</Message.Header>
                <p>{errorMsg}</p>
            </Message>
            <Button primary loading={loading}>Contribute</Button>
        </Form>
    );
};

export default ContributeForm;