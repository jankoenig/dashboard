import * as React from "react";
import JSONTree from "react-json-tree";
import { connect } from "react-redux";

import { getLogs } from "../actions/log";
import { setCurrentSource } from "../actions/source";
import { ConversationList } from "../components/ConversationList";
import { Cell, Grid } from "../components/Grid";
import Log from "../models/log";
import Source from "../models/source";
import { State } from "../reducers";
import Interaction from "./Interaction";

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

    constructor(props: LogsPageProps) {
        super(props);
        this.state = {
            source: undefined,
            request: undefined,
            response: undefined
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
                    response: this.state.response
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

    /* Comment out until we can style the console messages
    getConsoleMessages(): JSX.Element[] {

        let messages: JSX.Element[] = [];

        if (this.props.logs) {
            for (let log of this.props.logs) {
                if (typeof log.payload === "string") {
                    messages.push((<li key={log.id} id={log.id}>{log.payload}</li>));
                }
            }
        }

        return messages;
    } */

    onConversationClicked(request: Log, response: Log, event: React.MouseEvent) {
        this.setState({
            source: this.state.source,
            request: request,
            response: response
        });
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
                    { /*
                        Commenting out the console messages until we can style them better
                        <h6>CONSOLE</h6>
                        <ul>
                            {this.getConsoleMessages()}
                        </ul>
                    */ }
                </Cell>
                <Cell col={6} style={{ maxHeight: this.getContentHeight() - 30, overflowY: "scroll" }}>
                    <Interaction
                        request={this.state.request}
                        response={this.state.response}/>
                </Cell>
            </Grid>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LogsPage);