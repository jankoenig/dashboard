import * as moment from "moment";
import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router";

import { Cell, Grid } from "../components/Grid";
import Source from "../models/source";
import { State } from "../reducers";

interface SourceListPageProps {
    sources: Source[];
}

function mapStateToProps(state: State.All) {
    return {
        sources: state.source.sources
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<any>) {
    return {
    };
}

export class SourceListPage extends React.Component<SourceListPageProps, any> {
    render() {

        // Construct the list
        let listItems: JSX.Element[] = [];

        for (let source of this.props.sources) {
            listItems.push((
                <li key={source.id} className="mdl-list__item">
                    <Link to={"/skills/" + source.id}>{source.name}</Link>
                    <span style={{ textAlign: "center", marginLeft: "10px", fontSize: "12px" }}>
                        Created {moment(source.created).format("MMM Do, YYYY")}
                    </span>
                </li>
            ));
        }

        return (
            <Grid>
                <Cell col={12}>
                    {listItems.length === 0 ? (
                        <p>You don't have any skills yet, create one <Link to={"/skills/new"}>here.</Link></p>
                    ) : undefined}
                    <ul className="mdl-list">
                        {listItems}
                    </ul>
                </Cell>
            </Grid>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SourceListPage);
