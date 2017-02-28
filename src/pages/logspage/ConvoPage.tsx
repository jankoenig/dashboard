import * as React from "react";
import { connect } from "react-redux";

import Conversation from "../../models/conversation";
import LogQuery from "../../models/log-query";
import Source from "../../models/source";
import { State } from "../../reducers";
import ConvoExplorerPage from "./ConvoExplorerPage";
import FilterBar from "./FilterBar";
import { CompositeFilter, Filter } from "./filters/Filters";

interface ConvoPageStateProps {
    source: Source;
    logQuery: LogQuery;
}

interface ConvoPageDispatchProps {

}

interface ConvoPageProps extends ConvoPageStateProps, ConvoPageDispatchProps {

}

interface ConvoPageState {
    filter: CompositeFilter<Conversation>;
}

function mapStateToProps(state: State.All): ConvoPageStateProps {

    const source = state.source.currentSource;
    const logMap = state.log.logMap;
    const queryEvent = (source && logMap) ? state.log.logMap[source.id] : undefined;
    const query = (queryEvent) ? queryEvent.query : undefined;

    return {
        source: source,
        logQuery: query
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<any>): ConvoPageDispatchProps {
    return {};
}

export class ConvoPage extends React.Component<ConvoPageProps, ConvoPageState> {

    constructor(props: ConvoPageProps) {
        super(props);

        this.handleFilter = this.handleFilter.bind(this);
        this.handleLiveUpdate = this.handleFilter.bind(this);

        this.state = {
            filter: new CompositeFilter([])
        };
    }

    handleFilter(filter: Filter<Conversation>) {
        this.state.filter = this.state.filter.copyAndAddOrReplace(filter);
        this.setState(this.state);
    }

    handleLiveUpdate(enabled: boolean) {

    }

    render() {
        return (
            <div>
                <FilterBar
                    onFilterLogLevel={this.handleFilter}
                    onFilterRequest={this.handleFilter}
                    onFilterIntent={this.handleFilter}
                    onFilterDate={this.handleFilter}
                    onFilterException={this.handleFilter}
                    onFilterOrigin={this.handleFilter}
                    onLiveUpdate={this.handleLiveUpdate}
                    query={this.props.logQuery}
                    liveUpdateEnabled={true}
                    disableLiveUpdateCheckbox={false} />
                <ConvoExplorerPage
                    filter={this.state.filter} />
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ConvoPage);