import * as moment from "moment";
import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router";

import { Button } from "react-toolbox/lib/button";

import { List } from "../components/List/List";
import { TwoLineItem } from "../components/List/TwoLineItem";
import { Pane, TwoPane } from "../components/TwoPane";

import Source from "../models/source";

import { State } from "../reducers";

import HomePage from "./HomePage";

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

    leftPane(): Pane {
        return {
            cellStyle: { paddingLeft: "10px", paddingRight: "5px" },
            pane: (
                <div>
                    <SourceList
                        sources={this.props.sources} />
                    <div style={{ position: "relative" }}>
                        <Link to="/skills/new" style={{ position: "absolute", bottom: "2.5rem", right: "2.5rem" }} >
                            <Button icon="add" accent mini floating />
                        </Link>
                    </div>
                </div>
            )
        };
    }

    rightPane(): Pane {
        return {
            cellStyle: { paddingRight: "10px", paddingLeft: "5px" },
            pane: (
                <div>
                    <HomePage />
                </div>
            )
        };
    }

    render() {
        return (
            <TwoPane
                spacing={true}
                leftPane={this.leftPane.bind(this)}
                rightPane={this.rightPane.bind(this)} />
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
            <TwoLineItem
                primaryValue={source.name}
                secondaryValue={moment(source.created).format("MMM Do, YYYY")} />
        );
        // return (
        //     <li key={source.id} className="mdl-list__item">
        //         <Link to={"/skills/" + source.id}>{source.name}</Link>
        //         <span style={{ textAlign: "center", marginLeft: "10px", fontSize: "12px" }}>
        //             Created {moment(source.created).format("MMM Do, YYYY")}
        //         </span>
        //     </li>
        // );
    }

    render() {
        return (
            <div>
                {this.props.sources.length === 0 ?
                    (
                        <p>You don't have any skills yet, create one <Link to={"/skills/new"}>here.</Link></p>
                    ) :
                    (
                        <List
                            itemRenderer={this.renderItem.bind(this)}
                            length={this.props.sources.length}
                            type={"simple"} />
                    )
                }
            </div>
        );
    }
}