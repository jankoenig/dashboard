import * as moment from "moment";
import * as React from "react";
import { DateRangePicker, FocusedInputShape } from "react-dates";
import { connect } from "react-redux";
// import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import "!style!css!sass!react-dates/lib/css/_datepicker.css";

import { retrieveLogs } from "../actions/log";
import DataTile from "../components/DataTile";
import { Cell, Grid } from "../components/Grid";
import { OutputList } from "../components/OutputList";
import SessionListViewItem from "../components/Session/SessionListViewItem";
import ConversationList from "../models/conversation-list";
import ConversationListSummary from "../models/conversation-list-summary";
import Log from "../models/log";
import LogQuery from "../models/log-query";
import LogReceiver from "../models/LogReceiver";
import Output from "../models/output";
import Source from "../models/source";
import { State } from "../reducers";
import { LogMap } from "../reducers/log";

interface SessionsPageProps {
    logMap: LogMap;
    source: Source;
    isLoading: boolean;
    getLogs: (query: LogQuery) => Promise<Log[]>;
}

interface SessionsPageState {
    conversationList?: ConversationList;
    summary?: ConversationListSummary;
    startDate?: moment.Moment;
    endDate?: moment.Moment;
    focusedInput?: FocusedInputShape;
    debugLogs?: Output[];
}

function mapStateToProps(state: State.All) {
    return {
        isLoading: state.log.isLoading,
        logMap: state.log.logMap,
        source: state.source.currentSource
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<any>) {
    return {
        getLogs: function (query: LogQuery) {
            const fetchLogs = retrieveLogs(query);
            return fetchLogs(dispatch);
        },
    };
}

// TODO: Change to SessionsPage
export class SessionsPage extends React.Component<SessionsPageProps, SessionsPageState> implements LogReceiver {

    postLog(log: Log) {
        this.state.debugLogs.push(Output.fromLog(log));
    }

    constructor(props: SessionsPageProps) {
        super(props);
        console.log("constructor");

        this.state = {
            debugLogs: []
        };

        this.onDatesChange = this.onDatesChange.bind(this);
        this.onFocusChange = this.onFocusChange.bind(this);
        this.requestLogs = this.requestLogs.bind(this);
        this.parseLogs = this.parseLogs.bind(this);
    }

    componentDidMount() {
        console.log("component did mount");
        this.parseLogs();
    }

    componentWillReceiveProps(nextProps: SessionsPageProps, context: any) {
        console.log("willReceiveProps");

        if (!nextProps.source) {
            console.log("no source");
        }

        // if there is a source and NO logs
        if (nextProps.source && !nextProps.logMap[nextProps.source.id]) {
            console.log("we have a source but it does not have logs");
            // this.requestLogs(nextProps.source);
        } else {
            console.log("do not make a request");
            if (nextProps.source) {
                console.log("got a source though with logs:");
                console.log(nextProps.logMap[nextProps.source.id]);
            }
        }

        this.parseLogs();
    }

    parseLogs() {
        console.log("parse logs");

        if (this.props.source && this.props.logMap[this.props.source.id]) {
            console.log("with source and logs");
            console.log(this.props.logMap[this.props.source.id]);
            let logs = this.props.logMap[this.props.source.id].logs;
            let query = this.props.logMap[this.props.source.id].query;

            this.state.startDate = moment(query.startTime);
            this.state.endDate = moment(query.endTime);
            this.state.conversationList = ConversationList.fromLogs(logs);
            this.state.summary = new ConversationListSummary({
                startTime: query.startTime,
                endTime: query.endTime
            }, this.state.conversationList, this);
            this.setState(this.state);
        }
    }

    requestLogs(source: Source) {
        console.log("requestLogs");
        const query = new LogQuery({
            source: source,
            startTime: this.state.startDate.toDate(),
            endTime: this.state.endDate.toDate()
        });

        this.props.getLogs(query);
    }

    onDatesChange(dates: { startDate: moment.Moment, endDate: moment.Moment }) {
        this.setState(dates);
    }

    onFocusChange(focusedInput: FocusedInputShape) {
        this.setState({ focusedInput });
    }

    render() {
        const { focusedInput, startDate, endDate } = this.state;

        const sessionList: JSX.Element[] = [];

        if (this.state.conversationList) {
            for (let session of this.state.summary.sessions) {
                let key = new Date(session.start.timestamp).getTime();
                sessionList.push((
                    <SessionListViewItem session={session} key={key} />
                ));
            }
        }

        return (
            <span>
                <Grid>
                    <Cell col={5} offset={7} tablet={5} offsetTablet={4} phone={4} >
                        <DateRangePicker
                            disabled
                            startDate={startDate}
                            focusedInput={focusedInput}
                            endDate={endDate}
                            onDatesChange={this.onDatesChange}
                            onFocusChange={this.onFocusChange} />
                    </Cell>
                </Grid>
                {this.props.isLoading ? (
                    <Grid>
                        <Cell>
                            <p>Loading the logs...</p>
                        </Cell>
                    </Grid>
                ) : undefined}
                {this.state.conversationList ? (
                    <span>
                        <Grid>
                            <Cell>
                                <DataTile label="Events" value={this.state.summary.totalEvents.toString()} />
                            </Cell>
                            <Cell>
                                <DataTile label="Sessions" value={this.state.summary.sessions.length.toString()} />
                            </Cell>
                            <Cell>
                                <DataTile label="Unique Users" value={this.state.summary.totalUniqueUsers.toString()} />
                            </Cell>
                            <Cell>
                                <DataTile label="Session Errors" value={this.state.summary.failedSessions.length.toString()} />
                            </Cell>
                        </Grid>
                        {/**<Grid>
                            <Cell col={12} style={{ height: 500 }} >
                                <ResponsiveContainer>
                                    <BarChart
                                        data={this.state.summary.sessions}
                                        margin={{}}>
                                        <XAxis type="category" dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="total" fill="rgb(49, 130, 189)" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Cell>
                        </Grid>**/}
                        <Grid>
                            <Cell col={6}>
                                <ul style={{ listStyle: "none" }}>
                                    {sessionList}
                                </ul>
                            </Cell>
                        </Grid>
                    </span>
                ) : undefined}
                <Grid style={{ height: 400, overflow: "auto" }}>
                    <Cell col={12}>
                        <OutputList outputs={this.state.debugLogs} stackTraces={[]} />
                    </Cell>
                </Grid>
            </span>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SessionsPage);