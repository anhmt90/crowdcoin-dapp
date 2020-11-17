import React from 'react';
import { useRouter } from 'next/router';
import { Table, Button, Icon } from 'semantic-ui-react';

import web3 from '../ethereum/configWeb3';
import getCampaignInstance from '../ethereum/campaign';

const RequestRow = ({ id, request, backersCount, address }) => {
    const router = useRouter();

    const onApprove = async () => {
        const campaign = getCampaignInstance(address);
        const accounts = await web3.eth.getAccounts();
        await campaign.methods.approveRequest(id).send({
            from: accounts[0]
        });
        router.replace(`/campaigns/${address}/requests`);
    };

    const onFinalize = async () => {
        const campaign = getCampaignInstance(address);
        const accounts = await web3.eth.getAccounts();
        await campaign.methods.finalizeRequest(id).send({
            from: accounts[0]
        });
        router.replace(`/campaigns/${address}/requests`);
    };

    const { Row, Cell } = Table;
    const readyToFinalize = request.approvalCount > backersCount / 2;

    return (
        <Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
            <Cell>{id}</Cell>
            <Cell>{request.description}</Cell>
            <Cell textAlign="center">{web3.utils.fromWei(request.value)}</Cell>
            <Cell>{request.recipient}</Cell>
            <Cell textAlign="center">{request.approvalCount}/{backersCount}</Cell>
            <Cell>
                <Button
                    color={request.complete ? "grey" : "green"}
                    basic
                    disabled={request.complete}
                    onClick={onApprove}
                >
                    Approve
                </Button>
            </Cell>
            <Cell textAlign="center">
                {request.complete ?
                    <Icon name="checkmark" color="green" circular/>
                    :
                    <Button
                        color="teal"
                        basic
                        onClick={onFinalize}
                        disabled={!readyToFinalize}
                    >
                        Finalize
                </Button>
                }
            </Cell>
        </Row>
    );
};

export default RequestRow;