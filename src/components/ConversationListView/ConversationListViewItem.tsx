import * as moment from "moment";
import * as React from "react";

import Conversation, { Origin } from "../../models/conversation";
import Button from "../Button";
import AmazonEchoIcon from "../Icon/AmazonEcho";
import GoogleHomeIcon from "../Icon/GoogleHome";
import Interaction from "../Interaction";
import Pill from "../Pill";

interface ConversationListViewItemProps {
    readonly conversation: Conversation;
    readonly onClick: (conversation: Conversation, event: React.MouseEvent) => void;
    readonly active?: boolean;
    readonly showInteractionOnActive?: boolean;
}

export default class ConversationListViewItem extends React.Component<ConversationListViewItemProps, any> {

    listItemStyle(): React.CSSProperties {
        return {
            padding: "10px",
            marginTop: "10px",
            marginBottom: "10px",
            cursor: "pointer",
            backgroundColor: (this.props.active ? "#90A4AE" : "#FAFAFA"),
            border: "solid #90A4AE",
            borderWidth: "1px",
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
            borderBottomLeftRadius: "10px",
            borderBottomRightRadius: "10px",
            position: "relative",
            minHeight: "72px",
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

    iconWrapperStyle(): React.CSSProperties {
        return {
            borderRadius: "20px",
            width: "40px",
            height: "40px",
            textAlign: "center",
            float: "left",
            marginRight: "16px",
            marginTop: "5px"
        };
    }

    subtitleStyle(): React.CSSProperties {
        return {
            fontSize: "14px",
            display: "block"
        };
    }

    render() {
        return (
            <li key={this.props.conversation.id} style={{ listStyle: "none" }}>
                <div
                    style={this.listItemStyle()}
                    onClick={this.props.onClick.bind(this, this.props.conversation)}>
                    <span style={this.primaryContentStyle()}>
                        <div style={this.iconWrapperStyle()}>
                            <Icon fill={this.props.conversation.userColors.fill} origin={this.props.conversation.origin} />
                        </div>
                        <span>
                            {this.props.conversation.requestPayloadType}
                        </span>
                        <span style={this.subtitleStyle()}>
                            {moment(this.props.conversation.timestamp).format("MMM Do, h:mm:ss a")}
                            <span style={{ color: "#BDBDBD", paddingLeft: "5px" }}>{moment(this.props.conversation.timestamp).fromNow()} </span>
                        </span>
                    </span>
                    <span>
                        {this.props.conversation.hasError ? (
                            <Pill>
                                error
                            </Pill>
                        ) : undefined}
                        {this.props.conversation.hasException ? (
                            <Pill>
                                exception
                            </Pill>
                        ) : undefined}
                    </span>
                </div>
                {this.props.showInteractionOnActive && this.props.active ? (
                    <div>
                        <Interaction
                            request={this.props.conversation.request}
                            response={this.props.conversation.response}
                            outputs={this.props.conversation.outputs}
                            stackTraces={this.props.conversation.stackTraces} />
                        <Button
                            primary={true}
                            ripple={true}
                            onClick={this.props.onClick.bind(this, this.props.conversation)}><i className="material-icons">keyboard_arrow_up</i>Collapse</Button>
                    </div>
                ) : undefined}
            </li>
        );
    }
}

interface IconProps {
    origin: Origin;
    fill: string;
}

class Icon extends React.Component<IconProps, any> {
    render() {
        const iconStyle = { fill: this.props.fill, marginTop: "4px" };

        let icon: JSX.Element;
        if (this.props.origin === Origin.GoogleHome) {
            icon = (<GoogleHomeIcon style={iconStyle} width={"30px"} height={"30px"} color={this.props.fill} />);
        } else {
            icon = (<AmazonEchoIcon style={iconStyle} width={"30px"} height={"30px"} color={this.props.fill}  />);
        }
        return icon;
    }
}