import * as React from "react";

import * as Bubbles from "./Bubbles";

interface BlockQuoteStyle {
    borderColor: string;
}

interface SpeechBubbleProps {
    text: string;
    style?: Bubbles.BubbleStyle;
    cite?: string;
    blockStyle?: BlockQuoteStyle;
}

interface SpeechBubbleState {

}

export class SpeechBubble extends React.Component<SpeechBubbleProps, SpeechBubbleState> {

    render() {
        const { text, style, cite } = this.props;
        const bubble = Bubbles.getType(style);
        const { containerStyle, quoteStyle, trianglePosition, beforeTriangleStyle, afterTriangleStyle } = bubble;

        return (
            <div style={containerStyle}>
                <div style={quoteStyle}>
                    <p>{text}</p>
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