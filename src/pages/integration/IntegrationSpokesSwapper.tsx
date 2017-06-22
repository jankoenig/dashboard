import * as React from "react";

import IntegrationHttp from "./IntegrationHttp";
import IntegrationLambda from "./IntegrationLambda";

export type PAGE = "http" | "lambda";

interface IntegrationSpokesSwapperProps {
    showPage: PAGE;
    theme?: string;
    lambdaARN?: string;
    url?: string;
    awsAccessKeyInput?: string;
    awsSecretKeyInput?: string;
    onChange?: (type: "url" | "lambdaARN" | "awsAccessKeyInput" | "awsSecretKeyInput", newValue: string) => void;
    onFocus?: (type: any) => void;
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
        const { showPage, url, awsAccessKeyInput, awsSecretKeyInput, lambdaARN, ...others } = this.props;
        switch (showPage) {
            case "http":
                return (<IntegrationHttp {...others} url={url} onUrlChange={this.handleHttpChange} />);
            case "lambda":
                return (<IntegrationLambda {...others} awsAccessKeyInput={awsAccessKeyInput} awsSecretKeyInput={awsSecretKeyInput} lambdaARN={lambdaARN} />);
            default:
                return (<div />);
        }
    }
}

export default IntegrationSpokesSwapper;
