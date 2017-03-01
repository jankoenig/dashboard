import * as React from "react";

import Interaction from "../../components/Interaction";
import Conversation from "../../models/conversation";

interface ConvoViewPageProps {
    conversation?: Conversation;
}

interface ConvoViewPageState {

}

export class ConvoViewPage extends React.Component<ConvoViewPageProps, ConvoViewPageState> {
    render() {
        if (this.props.conversation) {
            return (<Interaction
                {...this.props.conversation}/>);
        } else {
            return (<div/>);
        }
    }
}

export default ConvoViewPage;