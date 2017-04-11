import * as React from "react";

import TwoPane from "../../components/TwoPane";
import Conversation from "../../models/conversation";
import ConvoListPage from "./ConvoListPage";
import ConvoViewPage from "./ConvoViewPage";
import { CompositeFilter } from "./filters/Filters";

interface ConvoExplorerPageProps {
    readonly filter?: CompositeFilter<Conversation>;
    readonly refreshOn?: boolean;
    readonly onIconClick?: (conversation: Conversation) => void;
    readonly iconStyle?: React.CSSProperties;
    readonly iconTooltip?: string;
}

interface ConvoExplorerPageState {
    readonly selectedConvo: Conversation;
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
        this.setState({ selectedConvo: convo });
    }

    render() {
        return (
            <TwoPane
                leftStyle={{ paddingLeft: "10px", paddingRight: "5px", zIndex: 1 }}
                rightStyle={{ paddingLeft: "5px", paddingRight: "10px" }}
                spacing={true}>
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