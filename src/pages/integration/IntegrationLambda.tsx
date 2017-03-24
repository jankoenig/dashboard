import * as React from "react";

import Input from "react-toolbox/lib/input";

interface LambdaProps {
    arn?: string;
    iamAccesskey?: string;
    iamSecretKey?: string;
    onChange?: (type: "arn" | "iamAccessKey" | "iamSecretKey", newValue: string) => void;

}

interface LambdaState {

}

export class IntegrationLambda extends React.Component<LambdaProps, LambdaState> {

    static defaultProps: LambdaProps = {
        arn: "",
        iamAccesskey: "",
        iamSecretKey: ""
    };

    constructor(props: LambdaProps) {
        super(props);
    }

    handleChange(type: "arn" | "iamAccessKey" | "iamSecretKey", newValue: string) {
        const { onChange } = this.props;
        if (onChange) {
            console.info("type " + type + " value = " + newValue);
            onChange(type, newValue);
        }
    }

    render() {
        const { arn, iamAccesskey, iamSecretKey } = this.props;
        return (
            <div>
                <Input
                    label={"Lambda ARN"}
                    value={arn}
                    onChange={this.handleChange.bind(this, "arn")} />
                <Input
                    label={"IAM Access Key"}
                    value={iamAccesskey}
                    onChange={this.handleChange.bind(this, "iamAccessKey")} />
                <Input
                    label={"IAM Secret Key"}
                    value={iamSecretKey}
                    onChange={this.handleChange.bind(this, "iamSecretKey")} />
            </div>);
    }
}

export default IntegrationLambda;