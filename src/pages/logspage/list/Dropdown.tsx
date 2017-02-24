import * as React from "react";

import { Button } from "react-toolbox/lib/button";

import Interaction from "../../../components/Interaction";
import Conversation from "../../../models/conversation";
import DefaultConvo from "../../../utils/DefaultConvo";
import Noop from "../../../utils/Noop";

interface DropdownProps {
    conversation: Conversation;
    showInteractionOnActive: boolean;
    active: boolean;
    onClick?: () => void;
}

interface DropdownState {
    showDropdown: boolean;
}

class Dropdown extends React.Component<DropdownProps, DropdownState> {

    static defaultProps: DropdownProps = {
        conversation: DefaultConvo,
        showInteractionOnActive: false,
        active: false,
        onClick: Noop
    };

    constructor(props: DropdownProps) {
        super(props);

        this.state = {
            showDropdown: props.showInteractionOnActive && props.active
        };
    }

    componentWillReceiveProps(props: DropdownProps, context: any) {
        const showDropdown = props.showInteractionOnActive && props.active;
        if (this.state.showDropdown !== showDropdown) {
            this.state.showDropdown = showDropdown;
            this.setState(this.state);
        }
    }

    render() {
        if (this.state.showDropdown) {
            return (<ActualComponent {...this.props} />);
        } else {
            return (<div />);
        }
    }
}

export default Dropdown;

interface ActualProps {
    conversation: Conversation;
    onClick: (conversation: Conversation) => void;
}

class ActualComponent extends React.Component<ActualProps, any> {

    constructor(props: ActualProps) {
        super(props);
    }

    render() {
        return (<div>
            <Interaction
                request={this.props.conversation.request}
                response={this.props.conversation.response}
                outputs={this.props.conversation.outputs}
                stackTraces={this.props.conversation.stackTraces} />
            <Button
                primary={true}
                ripple={true}
                onClick={this.props.onClick}>
                <i className="material-icons">keyboard_arrow_up</i>
                Collapse
            </Button>
        </div>);
    }
}