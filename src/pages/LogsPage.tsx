import * as moment from "moment";
import * as React from "react";
import JSONTree from "react-json-tree";
import { connect } from "react-redux";

import { getLogs } from "../actions/log";
import { Cell, Grid } from "../components/Grid";
import Log from "../models/log";
import Source from "../models/source";
import { State } from "../reducers";

interface LogsPageProps {
    logs: Log[];
    getLogs: (source: string) => (dispatch: Redux.Dispatch<any>) => void;
    params?: any;
    sources: Source[];
}

interface LogsPageState {
    source: Source | undefined;
    json: any;
}

function mapStateToProps(state: State.All) {
    return {
        logs: state.log.logs,
        sources: state.source.sources
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<any>) {
    return {
        getLogs: function (source: string) {
            dispatch(getLogs(source));
        }
    };
}

export class LogsPage extends React.Component<LogsPageProps, LogsPageState> {

    /**
     * JSONTree uses base16 style
     * For more info read http://chriskempson.com/projects/base16/
     * and themes http://chriskempson.github.io/base16/
     */
    monokaiTheme = {
        scheme: "monokai",
        author: "wimer hazenberg (http://www.monokai.nl)",
        base00: "#272822",
        base01: "#383830",
        base02: "#49483e",
        base03: "#75715e",
        base04: "#a59f85",
        base05: "#f8f8f2",
        base06: "#f5f4f1",
        base07: "#f9f8f5",
        base08: "#f92672",
        base09: "#fd971f",
        base0A: "#f4bf75",
        base0B: "#a6e22e",
        base0C: "#a1efe4",
        base0D: "#66d9ef",
        base0E: "#ae81ff",
        base0F: "#cc6633"
    };

    getJSONTreeStyle() {
        return {
            padding: "15px",
            borderRadius: "10px",
            borderStyle: "solid",
            borderWidth: "2px",
            borderColor: this.monokaiTheme.base0B
        };
    }

    getTheme() {
        return {
            extend: this.monokaiTheme,
            tree: this.getJSONTreeStyle()
        };
    }

    constructor(props: LogsPageProps) {
        super(props);
        this.state = {
            source: undefined,
            json: undefined
        };
    }

    setCurrentSourceFromSources(sources: Source[]) {
        // We are getting some props, lets first see if there are any sources, then we find the one with the matching slug
        for (let source of sources) {
            if (this.props.params.sourceSlug === source.slug) {
                this.props.getLogs(source.secretKey);
                this.setState({
                    source: source,
                    json: this.state.json
                });
            }
        }
    }

    componentWillReceiveProps(nextProps: LogsPageProps, nextContext: any) {
        if (this.state.source === undefined) {
            this.setCurrentSourceFromSources(nextProps.sources);
        }
    }

    componentWillMount() {
        if (this.state.source === undefined) {
            this.setCurrentSourceFromSources(this.props.sources);
        }
    }

    getConsoleMessages(): JSX.Element[] {

        let messages: JSX.Element[] = [];

        if (this.props.logs) {
            for (let log of this.props.logs) {
                if (typeof log.payload === "string") {
                    messages.push((<li key={log.id} id={log.id} onClick={this.onLogSelected.bind(this, log)}>{log.payload}</li>));
                }
            }
        }

        return messages;
    }

    getConversations(): JSX.Element[] {

        let conversations: JSX.Element[] = [];

        if (this.props.logs) {
            for (let log of this.props.logs) {
                if (log.tags.indexOf("request") > -1) {
                    let intent: string;

                    // console.log(moment(log.timestamp).fromNow());
                    // console.log(moment(log.timestamp).format("MMM Do h:mm a"));

                    if (log.payload.request.intent) {
                        intent = log.payload.request.intent.name;
                    } else {
                        intent = log.payload.request.type;
                    }

                    conversations.push((<li key={log.id} id={log.id} onClick={this.onLogSelected.bind(this, log)}>REQUEST: {intent} { moment(log.timestamp).fromNow() } </li>));
                }
                if (log.tags.indexOf("response") > -1) {
                    conversations.push((<li key={log.id} id={log.id} onClick={this.onLogSelected.bind(this, log)}>RESPONSE: {log.payload.response.outputSpeech.ssml} { moment(log.timestamp).fromNow() } </li>));
                }
            }
        }

        return conversations;
    }

    onLogSelected(log: Log, event: React.MouseEvent) {
        this.updateJSONTree(log);
    }

    updateJSONTree(log: Log) {
        this.setState({
            source: this.state.source,
            json: log.payload
        });
    };

    shouldExpandNode(keyName: string, data: any, level: number) {
        console.log(keyName);
        return true;
    }

    render() {
        // First we need to figure out what we display depending on if the logs are loading or if any exist
        let logs: JSX.Element = (<p>Loading logs...</p>);
        // It is much cleaner to put the logic outside the JSX below
        if (this.state.json) {
            logs = (<JSONTree data={this.state.json} hideRoot={true} invertTheme={false} theme={this.getTheme()} shouldExpandNode={this.shouldExpandNode} />);
        } else {
            logs = (<p>Select a conversation or message to inspect the payload</p>);
        }

        return (
            <div>
                {this.state.source ? (
                    <Grid>
                        <Cell col={12}>
                            <h3>{this.state.source.name}</h3>
                        </Cell>
                    </Grid>
                ) : undefined}
                <Grid>
                    <Cell col={6}>
                        <h6>CONVERSATIONS</h6>
                        <ul>
                            {this.getConversations()}
                        </ul>
                        <h6>CONSOLE</h6>
                        <ul>
                            {this.getConsoleMessages()}
                        </ul>
                    </Cell>
                    <Cell col={6}>
                        <h6>PAYLOAD</h6>
                        {logs}
                    </Cell>
                </Grid>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LogsPage);