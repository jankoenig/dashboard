import * as React from "react";

import IntegrationHttp from "./IntegrationHttp";
import IntegrationLambda from "./IntegrationLambda";

export type PAGE = "http" | "lambda";

interface IntegrationSpokesSwapperProps {
    showPage: PAGE;
    arn?: string;
    url?: string;
    iamAccessKey?: string;
    iamSecretKey?: string;
    onChange?: (type: "url" | "arn" | "iamAccessKey" | "iamSecretKey", newValue: string) => void;
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
        const { showPage } = this.props;
        switch (showPage) {
            case "http":
                return (<IntegrationHttp {...this.props} onUrlChange={this.handleHttpChange} />);
            case "lambda":
                return (<IntegrationLambda {...this.props} />);
            default:
                return (<div />);
        }
    }
}

export default IntegrationSpokesSwapper;