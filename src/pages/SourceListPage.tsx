import * as moment from "moment";
import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router";

import { Button } from "react-toolbox/lib/button";

import { List } from "../components/List/List";
import { TwoLineItem } from "../components/List/TwoLineItem";
import { TwoPane } from "../components/TwoPane";

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

    render() {
        let leftSide = (
            <div className="source_list_page_left">
                <SourceList
                    sources={this.props.sources} />
                <div style={{ position: "relative" }}>
                    <Link to="/skills/new" style={{ position: "absolute", bottom: "2.5rem", right: "2.5rem" }} >
                        <Button icon="add" accent mini floating />
                    </Link>
                </div>
            </div>
        );

        let rightSide = (
            <div className="source_list_page_right">
                <HomePage />
            </div>
        );

        return (
            <TwoPane
                spacing={true}
                leftStyle={{ paddingLeft: "10px", paddingRight: "5px" }}
                rightStyle={{ paddingRight: "10px", paddingLeft: "5px" }}>
                {leftSide}
                {rightSide}
            </TwoPane>
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
            <Link to={"/skills/" + source.id} style={{ textDecoration: "none" }}>
                <TwoLineItem
                    index={index}
                    primaryValue={source.name}
                    secondaryValue={moment(source.created).format("MMM Do, YYYY")} />
            </Link>
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