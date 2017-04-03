import * as React from "react";

import Input from "react-toolbox/lib/input";

interface LambdaProps {
    theme?: string;
    lambdaARN?: string;
    awsAccessKey?: string;
    awsSecretKey?: string;
    onChange?: (type: "lambdaARN" | "awsAccessKey" | "awsSecretKey", newValue: string) => void;

}

interface LambdaState {

}

export class IntegrationLambda extends React.Component<LambdaProps, LambdaState> {

    static defaultProps: LambdaProps = {
        lambdaARN: "",
        awsAccessKey: "",
        awsSecretKey: ""
    };

    constructor(props: LambdaProps) {
        super(props);

        this.handleArnChange = this.handleChange.bind(this, "lambdaARN");
        this.handleIamAccessKeyChange = this.handleChange.bind(this, "awsAccessKey");
        this.handleIamSecretKeyChange = this.handleChange.bind(this, "awsSecretKey");
    }

    handleArnChange: (type: "lambdaARN", newValue: string) => void;
    handleIamAccessKeyChange: (type: "awsAccessKey", newValue: string) => void;
    handleIamSecretKeyChange: (type: "awsSecretKey", newValue: string) => void;
    handleChange(type: "lambdaARN" | "awsAccessKey" | "awsSecretKey", newValue: string) {
        const { onChange } = this.props;
        if (onChange) {
            onChange(type, newValue);
        }
    }

    render() {
        const { lambdaARN, awsAccessKey, awsSecretKey, ...others } = this.props;
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
                    value={awsAccessKey}
                    onChange={this.handleIamAccessKeyChange} />
                <Input
                    {...others}
                    label={"IAM Secret Key"}
                    value={awsSecretKey}
                    onChange={this.handleIamSecretKeyChange} />
            </div>);
    }
}

export default IntegrationLambda;