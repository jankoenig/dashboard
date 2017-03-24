import * as React from "react";

import Input from "react-toolbox/lib/input";

interface LambdaProps {
    theme?: string;
    arn?: string;
    iamAccessKey?: string;
    iamSecretKey?: string;
    onChange?: (type: "arn" | "iamAccessKey" | "iamSecretKey", newValue: string) => void;

}

interface LambdaState {

}

export class IntegrationLambda extends React.Component<LambdaProps, LambdaState> {

    static defaultProps: LambdaProps = {
        arn: "",
        iamAccessKey: "",
        iamSecretKey: ""
    };

    constructor(props: LambdaProps) {
        super(props);

        this.handleArnChange = this.handleChange.bind(this, "arn");
        this.handleIamAccessKeyChange = this.handleChange.bind(this, "iamAccessKey");
        this.handleIamSecretKeyChange = this.handleChange.bind(this, "iamSecretKey");
    }

    handleArnChange: (type: "arn", newValue: string) => void;
    handleIamAccessKeyChange: (type: "iamAccessKey", newValue: string) => void;
    handleIamSecretKeyChange: (type: "iamSecretKey", newValue: string) => void;
    handleChange(type: "arn" | "iamAccessKey" | "iamSecretKey", newValue: string) {
        const { onChange } = this.props;
        if (onChange) {
            onChange(type, newValue);
        }
    }

    render() {
        const { arn, iamAccessKey, iamSecretKey, ...others } = this.props;
        return (
            <div>
                <Input
                    {...others}
                    label={"Lambda ARN"}
                    value={arn}
                    onChange={this.handleArnChange} />
                <Input
                    {...others}
                    label={"IAM Access Key"}
                    value={iamAccessKey}
                    onChange={this.handleIamAccessKeyChange} />
                <Input
                    {...others}
                    label={"IAM Secret Key"}
                    value={iamSecretKey}
                    onChange={this.handleIamSecretKeyChange} />
            </div>);
    }
}

export default IntegrationLambda;