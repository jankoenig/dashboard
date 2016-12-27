import * as moment from "moment";
import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router";

import { Button } from "react-toolbox/lib/button";

import Source from "../models/source";
import { State } from "../reducers";

let ReactList = require("react-list");

interface SourceListPageProps {
    sources: Source[];
}

interface SourceListPageState {
    listItems: JSX.Element[];
}

function mapStateToProps(state: State.All) {
    return {
        sources: state.source.sources
    };
}

export class SourceListPage extends React.Component<SourceListPageProps, SourceListPageState> {
    render() {
        return (
            <div>
                <SourceList
                    sources={this.props.sources}
                    />
                <Button style={{ position: "fixed", bottom: "3.6rem", right: "2.8rem" }} icon="add" floating accent mini />
            </div>
        );
    }
}

export default connect(
    mapStateToProps
)(SourceListPage);

interface SourceListProps {
    sources: Source[];
}

interface SourceListState {
}

class SourceList extends React.Component<SourceListProps, SourceListState> {
    renderItem(index: number, key: string): JSX.Element {
        let source = this.props.sources[index];
        return (
            <li key={source.id} className="mdl-list__item">
                <Link to={"/skills/" + source.id}>{source.name}</Link>
                <span style={{ textAlign: "center", marginLeft: "10px", fontSize: "12px" }}>
                    Created {moment(source.created).format("MMM Do, YYYY")}
                </span>
            </li>
        );
    }

    render() {
        return (
            <div>
                {this.props.sources.length === 0 ?
                    (
                        <p>You don't have any skills yet, create one <Link to={"/skills/new"}>here.</Link></p>
                    ) :
                    (
                        <ReactList
                            itemRenderer={this.renderItem.bind(this)}
                            length={this.props.sources.length}
                            type={"simple"} />
                    )
                }
            </div>
        );
    }
}