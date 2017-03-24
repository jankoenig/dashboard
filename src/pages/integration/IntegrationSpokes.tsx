import * as React from "react";

import { Button } from "react-toolbox/lib/button";
import Checkbox from "react-toolbox/lib/checkbox";
import Dropdown from "react-toolbox/lib/dropdown";

import { Cell, Grid } from "../../components/Grid";
import IntegrationSpokesSwapper, { PAGE } from "./IntegrationSpokesSwapper";

const DropdownTheme = require("./themes/dropdown.scss");
const InputTheme = require("./themes/input.scss");
const CheckboxTheme = require("./themes/checkbox.scss");
const ButtonTheme = require("./themes/button.scss");

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

    static PAGES: DropdownValue[] = [{ value: "http", label: "HTTP" }, { value: "lambda", label: "Lambda" }];

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
            <Grid>
                <Cell col={3} />
                <Cell col={12}>
                    <p>The HTTP SDK proxies traffic to your service (either HTTP or Lambda) via our Spokes.</p>
                    <p>To use it, simply select your service type, then enter your URL or ARN:</p>
                </Cell>
                <Cell col={3}>
                    <Dropdown
                        theme={DropdownTheme}
                        source={IntegrationSpokes.PAGES}
                        value={showPage}
                        onChange={this.handleSourceSwap}
                    />
                </Cell>
                <Cell col={9}/>
                <Cell col={6}>
                    <IntegrationSpokesSwapper
                        theme={InputTheme}
                        showPage={showPage}
                        onChange={this.handleSwapperChange}
                        {...others} />
                </Cell>
                <Cell col={6}/>
                <Cell col={3}>
                    <Checkbox
                        theme={CheckboxTheme}
                        label={"Enable Live Debugging"}
                        checked={enableLiveDebugging}
                        onChange={this.handleCheckChange} />
                </Cell>
                <Cell col={9}/>
                <Cell col={1}>
                    <Button
                        theme={ButtonTheme}
                        accent
                        raised
                        label="Save"
                        onClick={this.handleSave} />

                </Cell>
                <Cell col={3} />
            </Grid >
        );
    }
}

export default IntegrationSpokes;