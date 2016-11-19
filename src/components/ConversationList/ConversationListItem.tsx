import * as moment from "moment";
import * as React from "react";

import Conversation from "../../models/conversation";
import Button from "../Button";
import { Icon, ICON } from "../Icon";
import Interaction from "../Interaction";

interface ConversationListItemProps {
    readonly conversation: Conversation;
    readonly onClick: (conversation: Conversation, event: React.MouseEvent) => void;
    readonly active?: boolean;
    readonly showInteractionOnActive?: boolean;
}

export default class ConversationListItem extends React.Component<ConversationListItemProps, any> {

    listItemStyle(): React.CSSProperties {
        return {
            padding: "10px",
            marginTop: "10px",
            marginBottom: "10px",
            cursor: "hande",
            backgroundColor: (this.props.active ? "#90A4AE" : "#FAFAFA"),
            borderTop: "solid #90A4AE",
            borderBottom: "solid #90A4AE",
            borderWidth: "1px",
            position: "relative",
            height: "72px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            alignItems: "center",
            fontSize: "16px",
        };
    }

    primaryContentStyle(): React.CSSProperties {
        return {
            display: "block",
            order: 0,
            flexGrow: 2
        };
    }

    subtitleStyle(): React.CSSProperties {
        return {
            fontSize: "14px",
            display: "block"
        };
    }

    errorPillStyle(): React.CSSProperties {
        return {
            backgroundColor: "#e53935",
            padding: "5px",
            borderRadius: "5px",
            color: "#eeeeee",
            fontSize: "10px"
        };
    }

    render() {
        return (
            <span>
                <li key={this.props.conversation.id}
                    style={this.listItemStyle()}
                    onClick={this.props.onClick.bind(this, this.props.conversation)}>
                    <span style={this.primaryContentStyle()}>
                        {this.props.conversation.userId ? (
                            <div style={{ backgroundColor: this.props.conversation.userColors.background, borderRadius: "20px", width: "40px", height: "40px", textAlign: "center", float: "left", marginRight: "16px" }}>
                                <Icon
                                    style={{ fill: this.props.conversation.userColors.fill, marginTop: "4px" }}
                                    width={30}
                                    height={30}
                                    icon={ICON.DEFAULT_USER}
                                    />
                            </div>
                        ) : undefined}
                        <span>
                            {this.props.conversation.requestType}
                            {this.props.conversation.intent ? (
                                <span> - {this.props.conversation.intent} </span>
                            ) : undefined}
                        </span>
                        <span style={this.subtitleStyle()}>
                            {moment(this.props.conversation.timestamp).format("MMM Do, h:mm:ss a")}
                            <span style={{ color: "#BDBDBD", paddingLeft: "5px" }}>{moment(this.props.conversation.timestamp).fromNow()} </span>
                        </span>
                    </span>
                    <span>
                        {this.props.conversation.hasError ? (
                            <span style={this.errorPillStyle()}>
                                <span>error</span>
                            </span>
                        ) : undefined}
                    </span>
                </li>
                {this.props.showInteractionOnActive && this.props.active ? (
                    <span>
                        <Interaction
                            request={this.props.conversation.request}
                            response={this.props.conversation.response}
                            outputs={this.props.conversation.outputs} />
                        <Button
                        primary={true}
                        ripple={true}
                        icon={"keyboard_arrow_up"}
                        onClick={this.props.onClick.bind(this, this.props.conversation)}>Collapse</Button>
                    </span>
                ) : undefined}
            </span>
        );
    }
}