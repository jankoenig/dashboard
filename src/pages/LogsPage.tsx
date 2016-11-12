import * as React from "react";
import JSONTree from "react-json-tree";
import { connect } from "react-redux";

import { getLogs } from "../actions/log";
import { setCurrentSource } from "../actions/source";
import { ConversationList } from "../components/ConversationList";
import { Cell, Grid } from "../components/Grid";
import { OutputList } from "../components/OutputList";
import Conversation from "../models/conversation";
import Log from "../models/log";
import Output from "../models/output";
import Source from "../models/source";
import { State } from "../reducers";

interface LogsPageProps {
    logs: Log[];
    getLogs: (source: string) => (dispatch: Redux.Dispatch<any>) => void;
    setCurrentSource: (source: Source) => void;
    params?: any;
    sources: Source[];
}

interface LogsPageState {
    source: Source | undefined;
    request: Log | undefined;
    response: Log | undefined;
    outputs: Output[] | undefined;
}

function mapStateToProps(state: State.All) {
    return {
        logs: state.log.logs,
        sources: state.source.sources
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<any>) {
    return {
        setCurrentSource: function (source: Source) {
            dispatch(setCurrentSource(source));
        },
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
            request: undefined,
            response: undefined,
            outputs: []
        };
    }

    setCurrentSourceFromSources(sources: Source[]) {
        // We are getting some props,
        // lets first see if there are any sources,
        // then we find the one with the matching slug
        for (let source of sources) {
            if (this.props.params.sourceId === source.id) {
                this.props.setCurrentSource(source);
                this.props.getLogs(source.secretKey);
                this.setState({
                    source: source,
                    request: this.state.request,
                    response: this.state.response,
                    outputs: this.state.outputs
                });

                // Found a match, jump out of the loop
                break;
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

    componentWillUnmount() {
        // Clear out the current source when the page unmounts
        this.props.setCurrentSource(undefined);
    }

    onConversationClicked(conversation: Conversation, event: React.MouseEvent) {
        this.setState({
            source: this.state.source,
            request: conversation.request,
            response: conversation.response,
            outputs: conversation.outputs
        });
    }

    shouldExpandNode(keyName: string[], data: any, level: number) {
        // only expand the initial node, request and response by default
        if (keyName.length === 0 || keyName.indexOf("request") > -1 || keyName.indexOf("response") > -1) {
            return true;
        }
        return false;
    }

    getContentHeight() {
        if (document.getElementsByClassName !== undefined) {
            let mains = document.getElementsByClassName("mdl-layout__content");
            if (mains.length > 0) {
                let main: Element = mains.item(0);
                return main.clientHeight;
            }
        }
        // Return default height, this is when the page isn't fully rendered
        //  or when we are unit testing
        return 200;
    }

    getRequest(): JSX.Element {
        let request: JSX.Element = (<p>Loading logs...</p>);

        if (this.state.request) {
            request = (
                <JSONTree
                    data={this.state.request.payload}
                    hideRoot={true}
                    invertTheme={false}
                    theme={this.getTheme()}
                    shouldExpandNode={this.shouldExpandNode} />
            );
        } else {
            request = (<p>Select a conversation or message to inspect the payload</p>);
        }

        return request;
    }

    getResponse(): JSX.Element {
        let response: JSX.Element = (<p>Loading logs...</p>);

        if (this.state.response) {
            if (typeof this.state.response.payload !== "string") {
                response = (
                    <JSONTree
                        data={this.state.response.payload}
                        hideRoot={true}
                        invertTheme={false}
                        theme={this.getTheme()}
                        shouldExpandNode={this.shouldExpandNode} />
                );
            } else {
                response = undefined;
            }
        } else {
            response = (<p>Select a conversation or message to inspect the payload</p>);
        }

        return response;
    }

    render() {
        return (
            <Grid>
                <Cell col={6}>
                    <h6>CONVERSATIONS</h6>
                    <div style={{ maxHeight: this.getContentHeight() - 90, overflowY: "scroll" }}>
                        <ConversationList
                            logs={this.props.logs}
                            onClick={this.onConversationClicked.bind(this)} />
                    </div>
                </Cell>
                <Cell col={6} style={{ maxHeight: this.getContentHeight() - 30, overflowY: "scroll" }}>
                    <h6>REQUEST</h6>
                    {this.getRequest()}
                    <h6>CONSOLE</h6>
                    <OutputList outputs={this.state.outputs} />
                    <h6>RESPONSE</h6>
                    {this.getResponse()}
                </Cell>
            </Grid>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LogsPage);