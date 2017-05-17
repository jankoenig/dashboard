import * as React from "react";

import AudioComponent from "../../../components/Audio/AudioComponent";
import Conversation from "../../../models/conversation";
import DefaultConvo from "../../../utils/DefaultConvo";
import ConvoIcon from "./ConvoIcon";
import TimeTextComponent from "./ConvoTimeTextComponent";

const noobj = {};

interface MainContentProps {
    conversation: Conversation;
    primaryContentStyle?: React.CSSProperties;
    rightContentStyle?: React.CSSProperties;
    textContentStyle?: React.CSSProperties;
    subtitleStyle?: React.CSSProperties;
    iconStyle?: React.CSSProperties;
    onIconClick?: () => void;
    iconTooltip?: string;
}

class MainContentComponent extends React.Component<MainContentProps, any> {

    static defaultProperties: MainContentProps = {
        conversation: DefaultConvo,
        primaryContentStyle: noobj,
        rightContentStyle: noobj,
        textContentStyle: noobj,
        subtitleStyle: noobj,
        iconStyle: noobj
    };

    static primaryContentStyle: React.CSSProperties = {
        display: "flex",
        width: "100%",
        order: 0,
        flexGrow: 2
    };

    static rightContentStyle: React.CSSProperties = {
        width: "calc(100% - 55px)",
        marginLeft: 15
    };

    static rightContentWithSoundStyle: React.CSSProperties = {
      width: "calc(100% - 90px)",
      marginLeft: 15
    };

    static textContentStyle: React.CSSProperties = {
        display: "block",
        opacity: .7,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
    };

    static iconStyle: React.CSSProperties = {
        borderRadius: "20px",
        width: "40px",
        height: "40px",
        textAlign: "center",
        float: "left",
        alignSelf: "center",
        flexShrink: 0
    };

    static subtitleStyle: React.CSSProperties = {
        fontSize: "14px",
        display: "block"
    };

    render() {
        const primaryContentStyle = { ...MainContentComponent.primaryContentStyle, ...this.props.primaryContentStyle };
        const rightContentStyle = this.props.conversation.ssmlAudioUrl ? { ...MainContentComponent.rightContentWithSoundStyle, ...this.props.rightContentStyle } : { ...MainContentComponent.rightContentStyle, ...this.props.rightContentStyle };
        const textContentStyle = {...MainContentComponent.textContentStyle, ...this.props.textContentStyle};
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
                <div style={rightContentStyle}>
                    <span>
                        {this.props.conversation.requestPayloadType}
                    </span>
                   { this.props.conversation.outputSpeechText &&
                    <span style={textContentStyle}>
                        {`"${this.props.conversation.outputSpeechText}"`}
                    </span>}
                  { this.props.conversation.ssmlText &&
                  <span style={textContentStyle}>
                        {`"${this.props.conversation.ssmlText}"`}
                    </span>}
                    <TimeTextComponent
                        style={subtitleStyle}
                        timestamp={this.props.conversation.timestamp} />
                </div>
              {this.props.conversation.ssmlAudioUrl &&
                <AudioComponent src={this.props.conversation.ssmlAudioUrl} />}
            </span>
        );
    }
}

export default MainContentComponent;
