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
    readonly onClick: (conversation: Conversation) => void;
    readonly onIconClicked: (conversation: Conversation) => void;
    readonly active?: boolean;
    readonly showInteractionOnActive?: boolean;
}

export default class ConversationListViewItem extends React.Component<ConversationListViewItemProps, any> {

    static listItemStyle: React.CSSProperties = {
        padding: "10px",
        marginTop: "10px",
        marginBottom: "10px",
        cursor: "pointer",
        backgroundColor: "#FAFAFA",
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

    static listItemActiveStyle: React.CSSProperties =
    {
        padding: "10px",
        marginTop: "10px",
        marginBottom: "10px",
        cursor: "pointer",
        backgroundColor: "#90A4AE",
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

    static primaryContentStyle: React.CSSProperties = {
        display: "block",
        order: 0,
        flexGrow: 2
    };

    static iconWrapperStyle: React.CSSProperties = {
        borderRadius: "20px",
        width: "40px",
        height: "40px",
        textAlign: "center",
        float: "left",
        marginRight: "16px"
        // marginTop: "5px"
    };

    static subtitleStyle: React.CSSProperties = {
        fontSize: "14px",
        display: "block"
    };

    constructor(props: ConversationListViewItemProps) {
        super(props);

        this.handleIconClick = this.handleIconClick.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleIconClick() {
        this.props.onIconClicked(this.props.conversation);
    }

    handleClick() {
        this.props.onClick(this.props.conversation);
    }

    render() {
        const itemStyle = (this.props.active) ?
            ConversationListViewItem.listItemActiveStyle :
            ConversationListViewItem.listItemStyle;

        return (
            <li
                key={this.props.conversation.id}
                style={{ listStyle: "none" }}>
                <div
                    style={itemStyle}
                    onClick={this.handleClick}>
                    <span
                        style={ConversationListViewItem.primaryContentStyle}>
                        <div
                            style={ConversationListViewItem.iconWrapperStyle} >
                            <Icon
                                onClick={this.handleIconClick}
                                fill={this.props.conversation.userColors.fill}
                                origin={this.props.conversation.origin} />
                        </div>
                        <span>
                            {this.props.conversation.requestPayloadType}
                        </span>
                        <span
                            style={ConversationListViewItem.subtitleStyle}>
                            {moment(this.props.conversation.timestamp).format("MMM Do, h:mm:ss a")}
                            <span
                                style={{ color: "#BDBDBD", paddingLeft: "5px" }}>
                                {moment(this.props.conversation.timestamp).fromNow()}
                            </span>
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
    onClick?: () => void;
}

class Icon extends React.Component<IconProps, any> {
    render() {
        let icon: JSX.Element;
        if (this.props.origin === Origin.GoogleHome) {
            icon = (
                <GoogleHomeIcon
                    color={this.props.fill}
                    onClick={this.props.onClick} />
            );
        } else {
            icon = (
                <AmazonEchoIcon
                    color={this.props.fill}
                    onClick={this.props.onClick} />);
        }
        return icon;
    }
}