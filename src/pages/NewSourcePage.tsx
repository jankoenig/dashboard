import * as React from "react";
import { connect } from "react-redux";

import { Cell, Grid } from "../components/Grid";
import SourceForm from "../components/SourceForm";
import Source from "../models/source";
import { State } from "../reducers";

interface NewSourceProps {
    source?: Source;
}

function mapStateToProps(state: State.All) {

}

function mapDispatchToProps(dispatch: Redux.Dispatch<any>) {

}

export class NewSourcePage extends React.Component<any, any> {

    createSource(source: Source) {
        console.log(source);
    }

    render() {
        return (
            <div>
                <Grid>
                    <Cell col={12}>
                        <h5> It looks like you don't have any skills setup yet, let's fix that.</h5>
                    </Cell>
                </Grid>
                <Grid>
                    <Cell col={12}>
                        <h3>New Skill Setup</h3>
                    </Cell>
                </Grid>
                <Grid>
                    <Cell col={12}>
                        <SourceForm createSource={this.createSource} />
                    </Cell>
                </Grid>
                <Grid>
                    <Cell col={12}>
                        <h4>Copy and paste</h4>
                        <code>bst.log("thesource");</code>
                    </Cell>
                </Grid>
                <Grid>
                    <Cell col={12}>
                        <h4>Waiting for Logs</h4>
                    </Cell>
                </Grid>
            </div>
        );
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NewSourcePage);