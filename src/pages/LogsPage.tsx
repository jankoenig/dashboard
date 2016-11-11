import * as React from "react";
import { connect } from "react-redux";

import { getLogs } from "../actions/log";
import { ConversationList } from "../components/ConversationList";
import { Cell, Grid } from "../components/Grid";
import Log from "../models/log";
import Source from "../models/source";
import { State } from "../reducers";
import Interaction from "./Interaction";

interface LogsPageProps {
    logs: Log[];
    source: Source;
    getLogs: (source: string) => (dispatch: Redux.Dispatch<any>) => void;
    params?: any;
}

interface LogsPageState {
    source: Source | undefined;
    request: Log | undefined;
    response: Log | undefined;
}

function mapStateToProps(state: State.All) {
    return {
        logs: state.log.logs,
        source: state.source.currentSource
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

    constructor(props: LogsPageProps) {
        super(props);
        this.state = {
            source: props.source,
            request: undefined,
            response: undefined
        };
    }

    setCurrentSourceFromSources(source: Source) {
        if (source) {
            this.props.getLogs(source.secretKey);
            this.setState({
                source: source,
                request: this.state.request,
                response: this.state.response
            });
        }
    }

    componentWillReceiveProps(nextProps: LogsPageProps, nextContext: any): void {
        if (this.state.source === undefined) {
            this.setCurrentSourceFromSources(nextProps.source);
        }
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