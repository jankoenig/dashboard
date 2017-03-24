import * as React from "react";

import { Button } from "react-toolbox/lib/button";
import Checkbox from "react-toolbox/lib/checkbox";
import Dropdown from "react-toolbox/lib/dropdown";

import IntegrationSpokesSwapper, { PAGE } from "./IntegrationSpokesSwapper";

interface DropdownValue {
    value: PAGE;
    label: string;
}

interface IntegrationSpokesProps {
    saveSpokes?(): void;
}

interface IntegrationSpokesState {
    showPage: PAGE;
    enableLiveDebugging: boolean;
    url?: string;
    arn?: string;
    iamAccessKey?: string;
    iamSecretKey?: string;
}

export class IntegrationSpokes extends React.Component<IntegrationSpokesProps, IntegrationSpokesState> {

    static PAGES: DropdownValue[] = [ { value: "http", label: "HTTP" }, { value: "lambda", label: "Lambda" } ];

    constructor(props: IntegrationSpokesProps) {
        super(props);

        this.handleSourceSwap = this.handleSourceSwap.bind(this);
        this.handleCheckChange = this.handleCheckChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleSwapperChange = this.handleSwapperChange.bind(this);

        this.state = {
            showPage: IntegrationSpokes.PAGES[0].value,
            enableLiveDebugging: false
        };
    }

    handleSourceSwap(value: PAGE) {
        this.setState({ showPage: value } as IntegrationSpokesState);
    }

    handleCheckChange(value: boolean) {
        this.setState({ enableLiveDebugging: value } as IntegrationSpokesState);
    }

    handleSwapperChange(key: "url" | "iamAccessKey" | "iamSecretKey" | "arn", value: string) {
        let newObj = {} as any;
        newObj[key] = value;
        console.log(newObj);
        this.setState(newObj);
    }

    handleSave() {
        console.info("Saving");
    }

    render() {
        const { showPage, enableLiveDebugging, ...others } = this.state;
        return (
            <div>
                <p>The HTTP SDK proxies traffic to your service (either HTTP or Lambda) via our Spokes.</p>
                <p>
                    To use it, simply select your service type, then enter your URL or ARN:
                </p>
                <Dropdown
                    source={IntegrationSpokes.PAGES}
                    value={showPage}
                    onChange={this.handleSourceSwap}
                 />
                <IntegrationSpokesSwapper
                    showPage={showPage}
                    onChange={this.handleSwapperChange}
                    {...others} />
                <Checkbox
                    label={"Enable Live Debugging"}
                    checked={enableLiveDebugging}
                    onChange={this.handleCheckChange} />
                <Button
                    label="Save"
                    onClick={this.handleSave} />
            </div>
        );
    }
}

export default IntegrationSpokes;