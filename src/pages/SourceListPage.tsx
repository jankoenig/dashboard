import * as moment from "moment";
import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router";

import Button from "../components/Button";
import { Cell, Grid } from "../components/Grid";
import Source from "../models/source";
import { State } from "../reducers";

interface SourceListPageProps {
    sources: Source[];
}

interface SourceListState {
    listItems: JSX.Element[];
}

function mapStateToProps(state: State.All) {
    return {
        sources: state.source.sources
    };
}

export class SourceListPage extends React.Component<SourceListPageProps, SourceListState> {

    constructor(props: SourceListPageProps) {
        super(props);
        this.state = {
            listItems: this.newListItems(this.props.sources)
        };
    }

    componentWillReceiveProps(props: SourceListPageProps, context: any) {
        this.state.listItems = this.newListItems(props.sources);
        this.setState(this.state);
    }

    newListItems(sources: Source[]): JSX.Element[] {
        // Construct the list
        let listItems: JSX.Element[] = [];

        if (sources) {
            for (let source of sources) {
                listItems.push(this.newListItem(source));
            }
        }
        return listItems;
    }

    newListItem(source: Source): JSX.Element {
        if (source) {
            return (
                <li key={source.id} className="mdl-list__item">
                    <Link to={"/skills/" + source.id}>{source.name}</Link>
                    <span style={{ textAlign: "center", marginLeft: "10px", fontSize: "12px" }}>
                        Created {moment(source.created).format("MMM Do, YYYY")}
                    </span>
                </li>
            );
        }
        return <li key="NA" className="mdl-list__item"/>;
    }

    render() {
        let listItems = this.state.listItems;

        return (
            <div>
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
                {listItems.length !== 0 ? (
                    <Grid>
                        <Cell col={2}>
                            <Link to={"/skills/new"}><Button colored={true} raised={true}>New Skill</Button></Link>
                        </Cell>
                    </Grid>
                ) : undefined}
            </div>
        );
    }
}

export default connect(
    mapStateToProps
)(SourceListPage);
