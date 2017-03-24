import * as React from "react";

import IntegrationSpokesSwapper from "./IntegrationSpokesSwapper";

interface IntegrationSpokesProps {
    saveSpokes?(): void;
}

interface IntegrationSpokesState {
    showPage: "http" | "lambda";
    url: string;
    iamAccessKey: string;
    iamSecretKey: string;
}

export class IntegrationSpokes extends React.Component<IntegrationSpokesProps, IntegrationSpokesState> {

    render() {
        const { ...others } = this.state;
        return (
            <div>
                <span>The HTTP SDK proxies traffic to your service (either HTTP or Lambda) via our Spokes.</span>
                <span>To use it, simply select your service type, then enter your URL or ARN:</span>
                <IntegrationSpokesSwapper
                    {...others} />
            </div>
        );
    }
}

export default IntegrationSpokes;