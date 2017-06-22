import * as React from "react";

import Input from "react-toolbox/lib/input";

interface LambdaProps {
    theme?: string;
    lambdaARN?: string;
    awsAccessKeyInput?: string;
    awsSecretKeyInput?: string;
    onChange?: (type: "lambdaARN" | "awsAccessKeyInput" | "awsSecretKeyInput", newValue: string) => void;
    onFocus?: (type: any) => void;

}

interface LambdaState {

}

export class IntegrationLambda extends React.Component<LambdaProps, LambdaState> {

    static defaultProps: LambdaProps = {
        lambdaARN: "",
        awsAccessKeyInput: "",
        awsSecretKeyInput: ""
    };

    constructor(props: LambdaProps) {
        super(props);

        this.handleArnChange = this.handleChange.bind(this, "lambdaARN");
        this.handleIamAccessKeyChange = this.handleChange.bind(this, "awsAccessKeyInput");
        this.handleIamSecretKeyChange = this.handleChange.bind(this, "awsSecretKeyInput");
        this.handleAwsAccessKeyFocus = this.handleFocus.bind(this, "awsAccessKeyInput");
        this.handleAwsSecretKeyFocus = this.handleFocus.bind(this, "awsSecretKeyInput");
    }

    handleArnChange: (type: "lambdaARN", newValue: string) => void;
    handleIamAccessKeyChange: (type: "awsAccessKeyInput", newValue: string) => void;
    handleIamSecretKeyChange: (type: "awsSecretKeyInput", newValue: string) => void;
    handleChange(type: "lambdaARN" | "awsAccessKeyInput" | "awsSecretKeyInput", newValue: string) {
        const { onChange } = this.props;
        if (onChange) {
            onChange(type, newValue);
        }
    }

    handleAwsAccessKeyFocus: (type: "awsAccessKeyInput", newValue: string) => void;
    handleAwsSecretKeyFocus: (type: "awsSecretKeyInput", newValue: string) => void;
    handleFocus(type: any) {
        const { onFocus } = this.props;
        if (onFocus) {
            onFocus(type);
        }
    }

    render() {
        const { lambdaARN, awsAccessKeyInput, awsSecretKeyInput, ...others } = this.props;
        return (
            <div>
                <Input
                    {...others}
                    label={"Lambda ARN"}
                    value={lambdaARN}
                    onChange={this.handleArnChange} />
                <Input
                    {...others}
                    label={"IAM Access Key"}
                    value={awsAccessKeyInput}
                    onChange={this.handleIamAccessKeyChange}
                    onFocus={this.handleAwsAccessKeyFocus} />
                <Input
                    {...others}
                    label={"IAM Secret Key"}
                    value={awsSecretKeyInput}
                    onChange={this.handleIamSecretKeyChange}
                    onFocus={this.handleAwsSecretKeyFocus} />
            </div>);
    }
}

export default IntegrationLambda;
