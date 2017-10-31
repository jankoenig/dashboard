import * as pusher from "pusher-js";
import * as React from "react";
import { connect } from "react-redux";
import {Card, CardText, CardTitle} from "react-toolbox/lib/card";
import Checkbox from "react-toolbox/lib/checkbox";
import Input from "react-toolbox/lib/input";

import Dialog from "react-toolbox/lib/dialog";
import ProgressBar from "react-toolbox/lib/progress_bar";

import Button from "../../components/Button";
import {CodeSheet} from "../../components/CodeSheet";
import {Cell} from "../../components/Grid";
import Source from "../../models/source";
import {User, UserDetails} from "../../models/user";
import { State } from "../../reducers";
import auth from "../../services/auth";
import SourceService from "../../services/source";
import { Location } from "../../utils/Location";

const dashboardTheme = require("../../themes/dashboard.scss");
const inputTheme = require("../../themes/input.scss");
const checkboxTheme = require("../../themes/checkbox-theme.scss");

interface ValidationPageState {
    dialogActive: boolean;
    loadingValidationResults: boolean;
    monitorEnabled: boolean;
    script: string;
    validationResults: any;
    token: string;
    tokenChanged: boolean;
    showHelp: boolean;
    showVendorID: boolean;
    smAPIAccessToken: string;
    channels: any[];
    pusher: pusher.Pusher | undefined;
    vendorID: string;
    vendorIDChanged: boolean;
}

interface ValidationPageProps {
    location?: Location;
    user: User;
    source: Source;
}

function mapStateToProps(state: State.All) {
  return {
    source: state.source.currentSource,
    user: state.session.user
  };
}

export class ValidationPage extends React.Component<ValidationPageProps, ValidationPageState> {
    static readonly lastScriptKeyPrefix = "lastValidationScript";
    static readonly scriptHint = `"open we study billionaires": "welcome"`;
    constructor(props: any) {
        super(props);
        this.state = {
            dialogActive: false,
            monitorEnabled: false,
            script: "",
            validationResults: undefined,
            loadingValidationResults: false,
            token: "",
            tokenChanged: false,
            showHelp: false,
            showVendorID: false,
            smAPIAccessToken: "",
            channels: [],
            pusher: (process.env.PUSHER_APP_KEY ? new pusher(
                process.env.PUSHER_APP_KEY, {cluster: "us2", encrypted: true})
                : undefined),
            vendorID: "",
            vendorIDChanged: false,
        };
        this.handleScriptChange = this.handleScriptChange.bind(this);
        this.handleTokenChange = this.handleTokenChange.bind(this);
        this.handleMonitorEnabledCheckChange = this.handleMonitorEnabledCheckChange.bind(this);
        this.handleRun = this.handleRun.bind(this);
        this.handleDialogToggle = this.handleDialogToggle.bind(this);
        this.handleHelpChange = this.handleHelpChange.bind(this);
        this.lastScriptKey = this.lastScriptKey.bind(this);
        this.setupChannel = this.setupChannel.bind(this);
        this.handleVendorIDChange = this.handleVendorIDChange.bind(this);
        this.handleGetTokenClick = this.handleGetTokenClick.bind(this);
    }

    lastScriptKey(source: Source) {
        if (source && source.id) {
            return `${ValidationPage.lastScriptKeyPrefix}-${source.id}`;
        }
    }

    checkLastScript(source: Source) {
        if (window && window.localStorage) {
            const lastScriptRaw = window.localStorage.getItem(this.lastScriptKey(source));
            if (lastScriptRaw) {
                this.setState({...this.state, script: decodeURIComponent(lastScriptRaw)});
            }
        }
    }

    componentDidMount() {
        const self = this;
        self.checkLastScript(this.props.source);
        auth.currentUserDetails()
            .then((userDetails: UserDetails) => {
                self.setState({...this.state,
                    token: userDetails.silentEchoToken,
                    vendorID: userDetails.vendorID,
                    showVendorID: (!userDetails.vendorID || userDetails.vendorID === ""),
                    smAPIAccessToken: userDetails.smAPIAccessToken});
            });
    }

    setupChannel(token: string, timestamp: number) {
        if (!process.env.PUSHER_APP_KEY) return;
        const self = this;
        const channel = token + timestamp;
        self.setState({...self.state,
            channels: [...self.state.channels, channel]});
        self.state.pusher.subscribe(channel).bind("results", function(data: any) {
            const validationResults = (data && data.message &&
                data.message.validationResults);
            if (!validationResults) return;
            self.setState({
                ...self.state,
                dialogActive: true,
                loadingValidationResults: false,
                validationResults,
            });
        });
    }

    handleVendorIDChange(value: string) {
        this.setState({...this.state, vendorID: value, vendorIDChanged: true});
    }

    componentWillReceiveProps(nextProps: ValidationPageProps, context: any) {
        this.checkLastScript(nextProps.source);
    }

    handleScriptChange(value: string) {
        this.setState({...this.state, script: value});
    }

    handleHelpChange(e: any) {
        e.preventDefault();
        this.setState({...this.state, showHelp: !this.state.showHelp});
    }

    handleTokenChange(value: string) {
        this.setState({...this.state, token: value, tokenChanged: true});
    }

    handleMonitorEnabledCheckChange(value: boolean) {
        this.setState({...this.state, monitorEnabled: value});
    }

    handleRun(e: any) {
        e.preventDefault();
        const self = this;
        this.setState((prevState: any) => {
            return {...self.state, loadingValidationResults: true};
        }, () => {
            const validateSource = () => {
                const timestamp = Date.now();
                self.setupChannel(this.state.token, timestamp);
                SourceService.validateSource(this.props.user.userId, this.state.script,
                    this.state.token, timestamp, this.state.vendorID,
                    this.state.smAPIAccessToken, this.url())
                    .then((validationResults: any) => {
                        if (window && window.localStorage
                            && self.lastScriptKey(this.props.source)) {
                            window.localStorage.setItem(self.lastScriptKey(this.props.source),
                                encodeURIComponent(this.state.script));
                        }
                        self.setState({
                            ...self.state,
                            dialogActive: true,
                            loadingValidationResults: false,
                            validationResults,
                        });
                    })
                    .catch(() => {
                        self.setState({
                            ...self.state,
                            loadingValidationResults: false,
                        });
                    });
            };
            if (this.state.tokenChanged || this.state.vendorIDChanged) {
                const props: any = {};
                if (this.state.tokenChanged) {
                    props.silentEchoToken = this.state.token;
                }
                if (this.state.vendorIDChanged) {
                    props.vendorID = this.state.vendorID;
                }
                auth.updateCurrentUser(props)
                    .then(() => {
                        self.setState({
                            ...self.state,
                            tokenChanged: false,
                        });
                        validateSource();
                    });
            } else {
                validateSource();
            }
        });
    }

    handleDialogToggle = () => {
        if (process.env.PUSHER_APP_KEY && this.state.dialogActive) {
            this.state.channels.forEach(channel => {
                this.state.pusher.unsubscribe(channel);
            });
        }
        this.setState({...this.state, dialogActive: !this.state.dialogActive});
    }

    url(): string  {
        const baseURL = window.location.protocol + "//" +
            window.location.hostname +
            (window.location.port ? ":" + window.location.port : "");
        return `${baseURL}${this.props.location.basename}${this.props.location.pathname}`;
    }

    virtualDeviceLinkAccountURL(): string {
        const virtualDeviceURL = process.env.VIRTUAL_DEVICE_URL
            ? process.env.VIRTUAL_DEVICE_URL
            : "https://virtual-device.bespoken.io/";
        return this.props.user
            ? `${virtualDeviceURL}` +
            `link_account?dashboard_user_id=${this.props.user.userId}` +
            `&redirect_url=${this.url()}`
            : "";
    }

    handleGetTokenClick(e: any) {
        e.preventDefault();
        const redirect = () => {
            window.location.href = this.virtualDeviceLinkAccountURL();
        };
        if (this.state.vendorIDChanged) {
            const props: any = {vendorID: this.state.vendorID};
            auth.updateCurrentUser(props).then(() => redirect());
        }
        redirect();
    }

    render() {
        return (
                <form className="mdl-grid" onSubmit={this.handleRun}>
                    <Cell col={3} tablet={12}>
                        <Input className="sm-input" label="Validation Token" value={this.state.token} onChange={this.handleTokenChange} required={true}/>
                        Don't have a token yet? <a href="#" onClick={this.handleGetTokenClick}>Get it here</a>
                    </Cell>
                    {this.state.showVendorID
                    ? <Cell col={3} tablet={12}>
                            <Input className="sm-input" label="Vendor ID" value={this.state.vendorID} onChange={this.handleVendorIDChange} required={true}/>
                            To retrieve your vendor ID, <a href="https://developer.amazon.com/mycid.html" target="_blank">click here</a>. Please make sure it is for the correct organization if you belong to multiple.
                        </Cell>
                    : undefined}
                    <Cell col={12}>
                        <Cell col={6}>
                            <Input className="script-input" multiline={true}
                                value={this.state.script}
                                onChange={this.handleScriptChange}
                                hint={ValidationPage.scriptHint} required={true}/>
                            <p>Scripts will “speak” the sequence of commands listed above,
                                testing for the proper result - <a href="#" onClick={this.handleHelpChange}>click here for help</a>.
                            </p>
                        </Cell>
                    </Cell>
                    <Cell col={12}>
                        {this.state.showHelp ? <ValidationHelp/> : undefined}
                    </Cell>
                    <Cell col={12}>
                        <Button raised={true} disabled={this.state.loadingValidationResults}>
                            {this.state.loadingValidationResults
                            ? <ProgressBar className="circularProgressBar" type="circular" mode="indeterminate" />
                            : <span>Run</span>}
                        </Button>
                        <Dialog
                            className={`${dashboardTheme.dialog}`}
                            active={this.state.dialogActive}
                            onEscKeyDown={this.handleDialogToggle}
                            onOverlayClick={this.handleDialogToggle}>
                            <div dangerouslySetInnerHTML={{__html: this.state.validationResults}}/>
                        </Dialog>
                    </Cell>
                    <Cell style={{display: "none"}} col={12} className={`${inputTheme.checkbox}`}>
                        <Checkbox
                            theme={checkboxTheme}
                            label={"Enable Monitoring"}
                            checked={this.state.monitorEnabled}
                            onChange={this.handleMonitorEnabledCheckChange}/>
                    </Cell>
                </form>
        );
    }
}

export default connect(
  mapStateToProps
)(ValidationPage);

class ValidationHelp extends React.Component<any, any> {
    static highlight: React.CSSProperties = {
        fontWeight: "bold"
    };
    render() {
        return (
            <Card className={`${inputTheme.card}`}>
                <CardTitle><h6 className={`${inputTheme.title}`}>Validation Help</h6></CardTitle>
                <CardText>
                    <p>The Validation Script has the following structure:</p>
                    <CodeSheet>{
                        `"Input": "Expected Output"`
                    }</CodeSheet>
                    <p><span style={ValidationHelp.highlight}>Input</span>: What the user is meant to say to Alexa</p>
                    <p><span style={ValidationHelp.highlight}>Expected Output</span>: The expected response from Alexa</p>
                    <p>For the expected output:</p>
                    <ul>
                        <li>If the result is audio, the expected output is compared to the transcript of the audio.</li>
                        <li>If the result is a stream URL, the expected output is compared to the URL.</li>
                    </ul>
                    <p>In either case, the comparison works as a "contains" - if the value of the expected output appears anywhere in the result, it is accepted.</p>
                    <p>For example, in the case of a test like this:</p>
                    <CodeSheet>{`"hello": "hi"`}</CodeSheet>
                    <p>This test will succeed if the result is "hi", "hi there", or "oh hi"</p>
                    <p>Tests are run in a series, and can build off of each other. So a sequence may be:</p>
                    <CodeSheet>{
                        `"open my skill": "welcome"\n` +
                        `"about": "I am a skill"\n` +
                        `"more": "I can do things"`
                    }</CodeSheet>
                    <p>These commands will be run one after another, as if a user was interacting with Alexa through a series of prompts.</p>
                </CardText>
            </Card>
        );
    }
}
