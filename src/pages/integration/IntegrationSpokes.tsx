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
import Noop from "../../utils/Noop";
import IntegrationSpokesSwapper, { PAGE } from "./IntegrationSpokesSwapper";

const DropdownTheme = require("./themes/dropdown.scss");
const InputTheme = require("./themes/input.scss");
const CheckboxTheme = require("./themes/checkbox.scss");
const ButtonTheme = require("./themes/button.scss");

interface DropdownValue {
    readonly value: PAGE;
    readonly label: string;
}

interface Message {
    readonly style?: React.CSSProperties;
    readonly message?: string;
}

interface IntegrationSpokesGlobalStateProps {
    readonly user: User;
}

interface IntegrationSpokesStandardProps {
    readonly source: Source;
    readonly onSpokesSaved?: () => void;
}

interface IntegrationSpokesProps extends IntegrationSpokesGlobalStateProps, IntegrationSpokesStandardProps {
}

interface IntegrationSpokesState {
    readonly showPage: PAGE;
    readonly proxy: boolean;
    readonly message?: Message;
    readonly url?: string;
    readonly lambdaARN?: string;
    readonly awsAccessKey?: string;
    readonly awsSecretKey?: string;
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
        return { awsAccessKey: state.awsAccessKey, awsSecretKey: state.awsSecretKey, lambdaARN: state.lambdaARN };
    }
}

function mergeProps(stateProps: IntegrationSpokesGlobalStateProps, dispatchProps: any, parentProps: IntegrationSpokesStandardProps): IntegrationSpokesProps {
    return { ...parentProps, ...dispatchProps, ...stateProps };
}

export class IntegrationSpokes extends CancelableComponent<IntegrationSpokesProps, IntegrationSpokesState> {

    static defaultProps: IntegrationSpokesProps = {
        user: undefined,
        source: undefined,
        onSpokesSaved: Noop,
    };

    static PAGES: DropdownValue[] = [{ value: "http", label: "HTTP" }, { value: "lambda", label: "Lambda" }];

    static DEFAULT_MESSAGE_STYLE: React.CSSProperties = {
        visibility: "hidden"
    };

    static STANDARD_MESSAGE_STYLE: React.CSSProperties = {
        color: "#000000"
    };

    static ERROR_MESSAGE_STYLE: React.CSSProperties = {
        ...IntegrationSpokes.STANDARD_MESSAGE_STYLE, ...{
            color: "#FF0000"
        }
    };

    constructor(props: IntegrationSpokesProps) {
        super(props);

        this.handleSourceSwap = this.handleSourceSwap.bind(this);
        this.handleCheckChange = this.handleCheckChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleSwapperChange = this.handleSwapperChange.bind(this);

        this.state = {
            showPage: IntegrationSpokes.PAGES[0].value,
            message: { style: IntegrationSpokes.DEFAULT_MESSAGE_STYLE, message: "" },
            proxy: false
        };
    }

    componentWillMount() {
        this.downloadSpoke();
    }

    handleSourceSwap(value: PAGE) {
        this.setState({ showPage: value } as IntegrationSpokesState);
    }

    handleCheckChange(value: boolean) {
        this.setState({ proxy: value } as IntegrationSpokesState);
    }

    handleSwapperChange(key: "url" | "lambdaARN" | "awsAccessKey" | "awsSecretKey", value: string) {
        let newObj = {} as any;
        newObj[key] = value;
        this.setState(newObj);
    }

    handleSave() {
        const { user, source, onSpokesSaved } = this.props;
        const { proxy } = this.state;
        const resource = getResource(this.state);

        this.setState({ message: { style: IntegrationSpokes.STANDARD_MESSAGE_STYLE, message: "Saving..." } } as IntegrationSpokesState);
        this.resolve(SpokesService.savePipe(user, source, resource, proxy)
            .then(function (spoke: Spoke) {
                onSpokesSaved();
                return { style: IntegrationSpokes.STANDARD_MESSAGE_STYLE, message: "Spoke has been saved." };
            }).catch(function (err: Error) {
                console.error(err);
                return { style: IntegrationSpokes.ERROR_MESSAGE_STYLE, message: "An error ocurred while trying to save the spoke." };
            }).then((message?: Message) => {
                this.setState({ message: message } as IntegrationSpokesState);
            }));
    }

    downloadSpoke() {
        const { user, source } = this.props;

        this.resolve(SpokesService.fetchPipe(user, source)
            .then((spoke: Spoke) => {
                const { http, lambda } = spoke;
                const proxy = { proxy: spoke.proxy };
                const httpObj = (http) ? http : { url: undefined };
                const lambdaObj = (lambda) ? lambda : { lambdaARN: undefined, awsAccessKey: undefined, awsSecretKey: undefined };
                this.setState({ ...proxy, ...httpObj, ...lambdaObj } as IntegrationSpokesState);
            }));
    }

    render() {
        const { showPage, proxy, message, ...others } = this.state;
        let saveDisabled: boolean;
        switch (showPage) {
            case "http":
                saveDisabled = !validateUrl(others.url);
                break;
            case "lambda":
                saveDisabled = !(others.lambdaARN && others.awsAccessKey && others.awsSecretKey);
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
                        checked={proxy}
                        onChange={this.handleCheckChange} />
                </Cell>
                <Cell col={9} />
                <Cell col={2}>
                    <Button
                        theme={ButtonTheme}
                        accent
                        raised
                        disabled={saveDisabled}
                        label="Save"
                        onClick={this.handleSave} />
                    <p style={message.style}>{message.message}</p>
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