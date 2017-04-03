import * as React from "react";
import { connect } from "react-redux";

import { Button } from "react-toolbox/lib/button";
import Checkbox from "react-toolbox/lib/checkbox";
import Dropdown from "react-toolbox/lib/dropdown";

import { CancelableComponent } from "../../components/CancelableComponent";
import { Cell, Grid } from "../../components/Grid";
import Source from "../../models/source";
import Spoke from "../../models/spoke";
import User from "../../models/user";
import { State } from "../../reducers";
import SpokesService from "../../services/spokes";
import IntegrationSpokesSwapper, { PAGE } from "./IntegrationSpokesSwapper";

const DropdownTheme = require("./themes/dropdown.scss");
const InputTheme = require("./themes/input.scss");
const CheckboxTheme = require("./themes/checkbox.scss");
const ButtonTheme = require("./themes/button.scss");

interface DropdownValue {
    value: PAGE;
    label: string;
}

interface IntegrationSpokesGlobalStateProps {
    user: User;
}

interface IntegrationSpokesStandardProps {
    source: Source;
    onSpokesSaved?(): void;
}

interface IntegrationSpokesProps extends IntegrationSpokesGlobalStateProps, IntegrationSpokesStandardProps {
}

interface IntegrationSpokesState {
    showPage: PAGE;
    enableLiveDebugging: boolean;
    url?: string;
    arn?: string;
    iamAccessKey?: string;
    iamSecretKey?: string;
}

function mapStateToProps(state: State.All): IntegrationSpokesGlobalStateProps {
    return {
        user: state.session.user
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<any>) {
    return { /* nothing to match at the moment */ };
}

function getResource(state: IntegrationSpokesState): SpokesService.HTTP | SpokesService.Lambda {
    if (state.showPage === "http") {
        return { url: state.url };
    } else if (state.showPage === "lambda") {
        return { awsAccessKey: state.iamAccessKey, awsSecretKey: state.iamSecretKey, lambdaARN: state.arn };
    }
}

function mergeProps(stateProps: IntegrationSpokesGlobalStateProps, dispatchProps: any, parentProps: IntegrationSpokesStandardProps): IntegrationSpokesProps {
    return { ...parentProps, ...dispatchProps, ...stateProps };
}

export class IntegrationSpokes extends CancelableComponent<IntegrationSpokesProps, IntegrationSpokesState> {

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
        const { user, source, onSpokesSaved } = this.props;
        const { enableLiveDebugging } = this.state;
        const resource = getResource(this.state);

        console.info("Saving");
        console.log(user);
        console.log(source);
        console.log(resource);
        console.log(enableLiveDebugging);
        this.resolve(SpokesService.savePipe(user, source, resource, enableLiveDebugging))
            .then(function (spoke: Spoke) {
                console.info("Spoke saved.");
                console.log(spoke);
                onSpokesSaved();
                return spoke;
            }).catch(function (err: Error) {
                console.error(err);
            });
    }

    render() {
        const { showPage, enableLiveDebugging, ...others } = this.state;
        let saveDisabled: boolean;
        switch (showPage) {
            case "http":
                saveDisabled = !validateUrl(others.url);
                break;
            case "lambda":
                saveDisabled = !(others.arn && others.iamAccessKey && others.iamSecretKey);
                break;
            default:
                // We're apparently on something we don't know exists so don't let them go further.
                saveDisabled = true;
        }

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
                <Cell col={9} />
                <Cell col={6}>
                    <IntegrationSpokesSwapper
                        theme={InputTheme}
                        showPage={showPage}
                        onChange={this.handleSwapperChange}
                        {...others} />
                </Cell>
                <Cell col={6} />
                <Cell col={3}>
                    <Checkbox
                        theme={CheckboxTheme}
                        label={"Enable Live Debugging"}
                        checked={enableLiveDebugging}
                        onChange={this.handleCheckChange} />
                </Cell>
                <Cell col={9} />
                <Cell col={1}>
                    <Button
                        theme={ButtonTheme}
                        accent
                        raised
                        disabled={saveDisabled}
                        label="Save"
                        onClick={this.handleSave} />

                </Cell>
                <Cell col={3} />
            </Grid >
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(IntegrationSpokes);

function validateUrl(check?: string): boolean {
    // We're not going to go crazy here.
    const regex = /^(https?:\/\/).+/;
    return regex.test(check);
}