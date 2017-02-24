import * as moment from "moment";
import * as React from "react";
import { connect } from "react-redux";

import DataTile from "../components/DataTile";
import { Cell, Grid } from "../components/Grid";
import Source from "../models/source";
import { State } from "../reducers";

interface SettingsPageProps {
    source: Source;
}

interface SettingsPageState {

}

function mapStateToProps(state: State.All) {
    return {
        source: state.source.currentSource
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<any>) {
    return {

    };
}

export class SettingsPage extends React.Component<SettingsPageProps, SettingsPageState> {

    render() {
        const tileColor = "#ECEFF1";
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
            </span>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SettingsPage);