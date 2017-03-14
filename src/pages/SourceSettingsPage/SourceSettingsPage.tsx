import * as React from "react";
import { connect } from "react-redux";
import { replace, RouterAction } from "react-router-redux";
import { Button } from "react-toolbox/lib/button";
import Dialog from "react-toolbox/lib/dialog";

import { deleteSource } from "../../actions/source";
import { Cell, Grid } from "../../components/Grid";
import Source from "../../models/source";
import { State } from "../../reducers";
import SourceHeader from "./SourceHeader";

const DeleteButtonTheme = require("../../themes/button_theme.scss");
const DeleteDialogTheme = require("../../themes/dialog_theme.scss");

interface SourceSettingsPageProps {
    source: Source;
    goHome: () => RouterAction;
    removeSource: (source: Source) => Promise<Source>;
}

interface SourceSettingsPageState {
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

export class SourceSettingsPage extends React.Component<SourceSettingsPageProps, SourceSettingsPageState> {

    dialogActions: any[];

    constructor(props: SourceSettingsPageProps) {
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
        const sourceName = (this.props.source) ? this.props.source.name : "this skill";
        return (
            <span>
                {this.props.source ? (
                    <span>
                        <SourceHeader
                            source={this.props.source} />
                        <Grid>
                            <Cell>
                                <h5>Danger Zone</h5>
                            </Cell>
                        </Grid>
                        <Grid style={{backgroundColor: "red"}}>
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
                ) : undefined}
            </span>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SourceSettingsPage);