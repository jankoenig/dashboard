import * as React from "react";

import Conversation from "../../../models/conversation";
import DefaultConvo from "../../../utils/DefaultConvo";
import ConvoIcon from "./ConvoIcon";
import TimeTextComponent from "./ConvoTimeTextComponent";

const noobj = {};

interface MainContentProps {
    readonly conversation: Conversation;
    readonly primaryContentStyle?: React.CSSProperties;
    readonly subtitleStyle?: React.CSSProperties;
    readonly iconStyle?: React.CSSProperties;
    readonly onIconClick?: () => void;
    readonly iconTooltip?: string;
}

class MainContentComponent extends React.Component<MainContentProps, any> {

    static defaultProperties: MainContentProps = {
        conversation: DefaultConvo,
        primaryContentStyle: noobj,
        subtitleStyle: noobj,
        iconStyle: noobj
    };

    static primaryContentStyle: React.CSSProperties = {
        display: "block",
        order: 0,
        flexGrow: 2
    };

    static iconStyle: React.CSSProperties = {
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

    render() {
        const primaryContentStyle = { ...MainContentComponent.primaryContentStyle, ...this.props.primaryContentStyle };
        const iconContentStyle = { ...MainContentComponent.iconStyle, ...this.props.iconStyle };
        const subtitleStyle = { ...MainContentComponent.subtitleStyle, ...this.props.subtitleStyle };

        return (
            <span
                style={primaryContentStyle}>
                <ConvoIcon
                    style={iconContentStyle}
                    tooltip={this.props.iconTooltip}
                    onClick={this.props.onIconClick}
                    color={this.props.conversation.userColors.fill}
                    origin={this.props.conversation.origin} />
                <div>
                    <span>
                        {this.props.conversation.requestPayloadType}
                    </span>
                    <TimeTextComponent
                        style={subtitleStyle}
                        timestamp={this.props.conversation.timestamp} />
                </div>
            </span>
        );
    }
}

export default MainContentComponent;