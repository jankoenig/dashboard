import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router";

import { Cell, Grid } from "../components/Grid";
import Source from "../models/source";
import { State } from "../reducers";

interface SourcesListPageProps {
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

export class SourcesListPage extends React.Component<SourcesListPageProps, any> {
    render() {

        // Construct the list
        let listItems: JSX.Element[] = [];

        console.log(this.props.sources);

        for (let source of this.props.sources) {
            console.log(source);
            listItems.push((
                <li key={ source.name } className="mdl-list__item">
                <Link to={"/skills/" + source.slug + "/logs"}>{ source.name }</Link>
                </li>
                ));
        }

        return (
            <Grid>
              <Cell col={12}>
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
)(SourcesListPage);
