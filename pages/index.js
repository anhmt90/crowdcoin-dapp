import React, { useEffect } from 'react';
import factory from '../ethereum/factory';


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

    /**
     * useEffect won't be executed on server-side rendering (JS on browser disabled)
     * --> no fetching data with Next.js
     * ==> make use of getInitialProps()
     */
    // useEffect(async () => {
    //     const campaigns = await factory.methods.getDeployedCampaigns().call();
    //     console.log(campaigns);
    // }, []);

    return (
        <div>
            {campaigns[0]}
        </div>
    );

};

export default CampaignIndex;