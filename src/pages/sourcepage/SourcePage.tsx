import * as moment from "moment";
import * as React from "react";
import { connect } from "react-redux";
import { replace, RouterAction } from "react-router-redux";

import { Button } from "react-toolbox/lib/button";
import Dialog from "react-toolbox/lib/dialog";

import { deleteSource } from "../../actions/source";
import DataTile from "../../components/DataTile";
import { Cell, Grid } from "../../components/Grid";
import Source from "../../models/source";
import { State } from "../../reducers";

import SourceIntentSummary from "./SourceIntentSummary";
import SourceStats from "./SourceStats";
import SourceTimeSummary from "./SourceTimeSummary";

const DeleteButtonTheme = require("../../themes/button_theme.scss");
const DeleteDialogTheme = require("../../themes/dialog_theme.scss");

interface SourcePageProps {
    source: Source;
    goHome: () => RouterAction;
    removeSource: (source: Source) => Promise<Source>;
}

interface SourcePageState {
    deleteDialogActive: boolean;
}

function mapStateToProps(state: State.All) {
    return {
        source: state.source.currentSource
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<any>) {
    return {
        goHome: function (): RouterAction {
            return dispatch(replace("/"));
        },
        removeSource: function (source: Source): Promise<Source> {
            return dispatch(deleteSource(source));
        }
    };
}

export class SourcePage extends React.Component<SourcePageProps, SourcePageState> {

    dialogActions: any[];

    constructor(props: SourcePageProps) {
        super(props);
        this.handleDeleteDialogToggle = this.handleDeleteDialogToggle.bind(this);
        this.handleDeleteSkill = this.handleDeleteSkill.bind(this);

        this.dialogActions = [{
            label: "Cancel",
            onClick: this.handleDeleteDialogToggle
        }, {
            label: "Delete",
            onClick: this.handleDeleteSkill
        }];

        this.state = {
            deleteDialogActive: false,
        };
    }

    handleDeleteDialogToggle() {
        this.state.deleteDialogActive = !this.state.deleteDialogActive;
        this.setState(this.state);
    }

    handleDeleteSkill(): Promise<Source> {
        const goBack = this.props.goHome;
        const source = this.props.source;
        return this.props.removeSource(source)
            .then(function (source: Source) {
                goBack();
                return source;
            }).catch(function (e: Error) {
                console.error(e);
                return source;
            });
    }

    render() {
        const tileColor = "#ECEFF1";
        const sourceName = (this.props.source) ? this.props.source.name : "this skill";
        return (
            <span>
                {this.props.source ? (
                    <span>
                        <Grid style={{ backgroundColor: "rgb(36, 48, 54)", paddingBottom: "0px", paddingTop: "0px" }}>
                            <Cell col={3} hidePhone={true}>
                                <DataTile
                                    theme={{ inputTextColor: tileColor, bottomBorderColor: tileColor }}
                                    value={this.props.source.name}
                                    label={"Name"} />
                            </Cell>
                            <Cell col={3} hidePhone={true} >
                                <DataTile
                                    theme={{ inputTextColor: tileColor, bottomBorderColor: tileColor }}
                                    value={this.props.source.id}
                                    label={"ID"} />
                            </Cell>
                            <Cell col={3} hidePhone={true} >
                                <DataTile
                                    theme={{ inputTextColor: tileColor, bottomBorderColor: tileColor }}
                                    value={moment(this.props.source.created).format("MMM Do, YYYY")}
                                    label={"Created"} />
                            </Cell>
                            <Cell col={3} hidePhone={true} >
                                <DataTile
                                    theme={{ inputTextColor: tileColor, bottomBorderColor: tileColor }}
                                    value={this.props.source.secretKey}
                                    label={"Secret Key"}
                                    hidden={true}
                                    showable={true} />
                            </Cell>
                        </Grid>
                    </span>
                ) : undefined}
                <SummaryView
                    source={this.props.source} />
                <Grid>
                    <Cell>
                        <Button
                            theme={DeleteButtonTheme}
                            raised
                            primary
                            onClick={this.handleDeleteDialogToggle}
                            label="Delete Skill" />
                    </Cell>
                </Grid>

                <Dialog
                    theme={DeleteDialogTheme}
                    actions={this.dialogActions}
                    active={this.state.deleteDialogActive}
                    onEscKeyDown={this.handleDeleteDialogToggle}
                    onOverlayClick={this.handleDeleteDialogToggle}
                    title="Delete Skill" >
                    <p>Are you sure you want to delete {sourceName}? This action can not be undone.</p>
                </Dialog>
            </span>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SourcePage);

interface SummaryViewProps {
    source: Source;
}

interface SummaryDataState {
}

class SummaryView extends React.Component<SummaryViewProps, SummaryDataState> {

    constructor(props: SummaryViewProps) {
        super(props);
        this.state = {
            eventsLabel: "",
            usersLabel: "",
            errorsLabel: ""
        };
    }

    render() {
        let summary: JSX.Element;
        const start = moment().subtract(7, "days");
        const end = moment();
        summary = (
            <span>
                <SourceStats
                    source={this.props.source}
                    startDate={start}
                    endDate={end} />
                <Grid>
                    <Cell col={12} style={{ height: 300 }}>
                        <SourceTimeSummary
                            source={this.props.source}
                            startDate={start}
                            endDate={end} />
                    </Cell>
                </Grid>
                <Grid>
                    <Cell col={12} >
                        <SourceIntentSummary
                            source={this.props.source}
                            startDate={start}
                            endDate={end} />
                    </Cell>
                </Grid>
            </span>
        );

        return (
            <div>
                <Grid>
                    <h4> Last Seven Day Summary </h4>
                </Grid>
                {summary}
            </div>
        );
    }
}