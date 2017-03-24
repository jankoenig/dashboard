import * as React from "react";

import IntegrationHttp from "./IntegrationHttp";
import IntegrationLambda from "./IntegrationLambda";

export type PAGE = "http" | "lambda";

interface IntegrationSpokesSwapperProps {
    showPage: PAGE;
    theme?: string;
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
        const { showPage, ...others } = this.props;
        switch (showPage) {
            case "http":
                return (<IntegrationHttp {...others} onUrlChange={this.handleHttpChange} />);
            case "lambda":
                return (<IntegrationLambda {...others} />);
            default:
                return (<div />);
        }
    }
}

export default IntegrationSpokesSwapper;