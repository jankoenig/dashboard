import * as React from "react";

import Interaction from "../../components/Interaction";
import Conversation from "../../models/conversation";

interface ConvoViewPageProps {
    readonly conversation?: Conversation;
}

interface ConvoViewPageState {

}

export class ConvoViewPage extends React.Component<ConvoViewPageProps, ConvoViewPageState> {
    render() {
        console.log(this.props.conversation);
        if (this.props.conversation) {
            return (<Interaction
                {...this.props.conversation}/>);
        } else {
            return (<div/>);
        }
    }
}

export default ConvoViewPage;