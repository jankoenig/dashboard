import * as React from "react";

import * as Bubbles from "./Bubbles";

interface SpeechBubbleProps {
    text: string;
    style?: Bubbles.BubbleStyle;
    cite?: string;
    modifiers?: Bubbles.Modifiers;
    textStyle?: React.CSSProperties;
}

interface SpeechBubbleState {

}

export class SpeechBubble extends React.Component<SpeechBubbleProps, SpeechBubbleState> {

    static defaultTextStyle: React.CSSProperties = {
        fontSize: "2vw",
        margin: "2vw",
        color: "#000"
    };

    render() {
        const { text, textStyle, style, cite, modifiers } = this.props;
        const bubble = Bubbles.getType(style, modifiers);
        const { containerStyle, quoteStyle, trianglePosition, beforeTriangleStyle, afterTriangleStyle } = bubble;
        const realTextStyle = { ...SpeechBubble.defaultTextStyle, ...textStyle };

        return (
            <div style={containerStyle}>
                <div style={quoteStyle}>
                    <p style={realTextStyle}>{text}</p>
                    {(cite) ? <cite>{cite}</cite> : undefined}
                </div>
                <div style={trianglePosition} >
                    <div style={{ position: "relative" }}>
                        <div style={beforeTriangleStyle} />
                        <div style={afterTriangleStyle} />
                    </div>
                </div>
            </div>
        );
    }
}

export default SpeechBubble;