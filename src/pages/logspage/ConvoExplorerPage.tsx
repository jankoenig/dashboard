import * as React from "react";

import TwoPane from "../../components/TwoPane";
import Conversation from "../../models/conversation";
import ConvoListPage from "./ConvoListPage";
import ConvoViewPage from "./ConvoViewPage";
import { CompositeFilter } from "./filters/Filters";

interface ConvoExplorerPageProps {
    filter?: CompositeFilter<Conversation>;
    refreshOn?: boolean;
}

interface ConvoExplorerPageState {
    selectedConvo: Conversation;
}

export class ConvoExplorerPage extends React.Component<ConvoExplorerPageProps, ConvoExplorerPageState> {

    constructor(props: ConvoExplorerPageProps) {
        super(props);

        this.handleItemClick = this.handleItemClick.bind(this);

        this.state = {
            selectedConvo: undefined
        };
    }

    handleItemClick(convo: Conversation) {
        this.state.selectedConvo = convo;
        this.setState(this.state);
    }

    render() {
        return (
            <TwoPane
                spacing={false}>
                <ConvoListPage
                    {...this.props}
                    onItemClick={this.handleItemClick} />
                <ConvoViewPage
                    conversation={this.state.selectedConvo} />
            </TwoPane>
        );
    }
}

export default ConvoExplorerPage;