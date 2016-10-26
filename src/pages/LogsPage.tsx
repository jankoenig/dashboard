import * as React from "react";
import { connect } from "react-redux";

import JSONTree from "react-json-tree";

import { getLogs } from "../actions/log";
import { Cell, Grid } from "../components/Grid";
import Log from "../models/log";
import { State } from "../reducers";

interface LogsPageProps {
    logs: Log[];
    getLogs: (source: string) => (dispatch: Redux.Dispatch<any>) => void;
    params: any;
}

function mapStateToProps(state: State.All) {
    return {
        logs: state.logs.logs
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<any>) {
    return {
        getLogs: function (source: string) {
            dispatch(getLogs(source));
        }
    };
}

export class LogsPage extends React.Component<LogsPageProps, any> {

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

    componentWillMount() {
        this.props.getLogs(this.props.params.source);
    }

    render() {
        return (
            <div>
                <Grid>
                    <Cell col={12}>
                        <h3>{this.props.params.source}</h3>
                    </Cell>
                </Grid>
                <Grid>
                    <Cell col={12}>
                        { this.props.logs ? (
                            <JSONTree data={this.props.logs} hideRoot={true} invertTheme={ false } theme={ this.getTheme() }/>
                        ) : (
                            <p> Loading logs... </p>
                        )}
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