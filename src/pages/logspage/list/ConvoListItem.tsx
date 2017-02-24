import * as React from "react";

import Conversation from "../../../models/conversation";
import ConvoMainContent from "./ConvoMainContent";
import ConvoPill from "./ConvoPill";
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

export default class ConvoListViewItem extends React.Component<ConvoListViewItemProps, any> {

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
        ...ConvoListViewItem.listItemStyle,
        ...{
            backgroundColor: "#90A4AE"
        }
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
            ConvoListViewItem.listItemActiveStyle :
            ConvoListViewItem.listItemStyle;

        return (
            <li
                key={this.props.conversation.id}
                style={{ listStyle: "none" }}>
                <div
                    style={itemStyle}
                    onClick={this.handleClick}>
                    <ConvoMainContent
                        {...this.props}
                        onIconClick={this.handleIconClick} />
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
