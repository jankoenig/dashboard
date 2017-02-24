import * as React from "react";

import Conversation from "../../../models/conversation";
import ConvoIcon from "./ConvoIcon";
import ConvoPill from "./ConvoPill";
import TimeTextComponent from "./ConvoTimeTextComponent";
import Dropdown from "./Dropdown";

interface ConvoListViewItemProps {
    conversation: Conversation;
    onClick?: (conversation: Conversation) => void;
    onIconClick?: (conversation: Conversation) => void;
    iconTooltip?: string;
    iconStyle?: React.CSSProperties;
    active?: boolean;
    showInteractionOnActive?: boolean;
}

export default class ConversationListViewItem extends React.Component<ConvoListViewItemProps, any> {

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

    static listItemActiveStyle: React.CSSProperties = {
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
    };

    static subtitleStyle: React.CSSProperties = {
        fontSize: "14px",
        display: "block"
    };

    constructor(props: ConvoListViewItemProps) {
        super(props);

        this.handleIconClick = this.handleIconClick.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleIconClick() {
        this.props.onIconClick(this.props.conversation);
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
                            <ConvoIcon
                                style={this.props.iconStyle}
                                tooltip={this.props.iconTooltip}
                                onClick={this.handleIconClick}
                                color={this.props.conversation.userColors.fill}
                                origin={this.props.conversation.origin} />
                        </div>
                        <span>
                            {this.props.conversation.requestPayloadType}
                        </span>
                        <TimeTextComponent
                            style={ConversationListViewItem.subtitleStyle}
                            timestamp={this.props.conversation.timestamp} />
                    </span>
                    <ConvoPill
                        show={this.props.conversation.hasError}
                        text={"error"}
                    />
                    <ConvoPill
                        show={this.props.conversation.hasException}
                        text={"exception"}
                    />
                </div>
                <Dropdown
                    {...this.props}
                    onClick={this.handleClick} />
            </li>
        );
    }
}
