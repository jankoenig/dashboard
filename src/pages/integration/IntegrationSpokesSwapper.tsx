import * as React from "react";

import IntegrationHttp from "./IntegrationHttp";
import IntegrationLambda from "./IntegrationLambda";

export type PAGE = "http" | "lambda";

interface IntegrationSpokesSwapperProps {
    showPage: PAGE;
    theme?: string;
    lambdaARN?: string;
    url?: string;
    awsAccessKey?: string;
    awsSecretKey?: string;
    onChange?: (type: "url" | "lambdaARN" | "awsAccessKey" | "awsSecretKey", newValue: string) => void;
}

interface IntegrationSpokesSwapperState {

}

export class IntegrationSpokesSwapper extends React.Component<IntegrationSpokesSwapperProps, IntegrationSpokesSwapperState> {

    constructor(props: IntegrationSpokesSwapperProps) {
        super(props);

        this.handleHttpChange = this.handleHttpChange.bind(this);
    }

    handleHttpChange(value: string) {
        const { onChange } = this.props;
        if (onChange) {
            onChange("url", value);
        }
    }

    render() {
        const { showPage, url, awsAccessKey, awsSecretKey, lambdaARN, ...others } = this.props;
        switch (showPage) {
            case "http":
                return (<IntegrationHttp {...others} url={url} onUrlChange={this.handleHttpChange} />);
            case "lambda":
                return (<IntegrationLambda {...others} awsAccessKey={awsAccessKey} awsSecretKey={awsSecretKey} lambdaARN={lambdaARN} />);
            default:
                return (<div />);
        }
    }
}

export default IntegrationSpokesSwapper;