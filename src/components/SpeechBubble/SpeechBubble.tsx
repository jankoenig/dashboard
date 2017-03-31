import * as React from "react";

interface BlockQuoteStyle {
    borderColor: string;
}

interface SpeechBubbleProps {
    text: string;
    cite?: string;
    blockStyle?: BlockQuoteStyle;
}

interface SpeechBubbleState {

}


interface BubbleType {
    containerStyle: React.CSSProperties;
    quoteStyle: React.CSSProperties;
    trianglePosition: React.CSSProperties;
    beforeTriangleStyle: React.CSSProperties;
    afterTriangleStyle: React.CSSProperties;
}

class BaseType implements BubbleType {
    containerStyle: React.CSSProperties = {
        position: "relative",
        zIndex: 1
    };

    quoteStyle: React.CSSProperties = {
        position: "relative",
        padding: "15px",
        margin: "1em 0 3em",
        color: "#000",
        borderRadius: "10px",
        background: "#f3961c"
    };

    trianglePosition: React.CSSProperties = {
        display: "block", /* reduce the damage in FF3.0 */
        position: "absolute",
        bottom: "-15px",
        left: "50px",
    };

    beforeTriangleStyle: React.CSSProperties = {
    };

    afterTriangleStyle: React.CSSProperties = {
        content: "",
        width: 0,
        borderWidth: "15px 15px 0",
        borderStyle: "solid",
        borderColor: "#f3961c transparent"
    };

    constructor(type: BubbleType) {
        this.containerStyle = { ...this.containerStyle, ...type.containerStyle };
        this.quoteStyle = { ...this.quoteStyle, ...type.quoteStyle };
        this.trianglePosition = { ...this.trianglePosition, ...type.trianglePosition };
        this.beforeTriangleStyle = { ...this.beforeTriangleStyle, ...type.beforeTriangleStyle };
        this.afterTriangleStyle = { ...this.afterTriangleStyle, ...type.afterTriangleStyle };
    }
}

class NoChange implements BubbleType {
    containerStyle: React.CSSProperties = {};
    quoteStyle: React.CSSProperties = {};
    trianglePosition: React.CSSProperties = {};
    beforeTriangleStyle: React.CSSProperties = {};
    afterTriangleStyle: React.CSSProperties = {};
}

class IsoscelesTriangle extends NoChange {
}

class ObtuseTriangle extends NoChange {
    quoteStyle = {
        color: "#fff",
        background: "#c81e2b"
    };

    trianglePosition = {
        bottom: "-50px",
        left: "60px",
    };

    beforeTriangleStyle = {
        border: 0,
        borderRightWidth: "50px",
        borderBottomWidth: "60px",
        borderStyle: "solid",
        borderColor: "transparent #c81e2b",
        width: 0
    };

    afterTriangleStyle = {
        bottom: "-60px",
        left: "95px",
        border: 0,
        borderRightWidth: "20px",
        borderBottomWidth: "60px",
        borderStyle: "solid",
        borderColor: "transparent #fff",
    };
}

export class SpeechBubble extends React.Component<SpeechBubbleProps, SpeechBubbleState> {

    private static styles: any = {
        "isosceles": new IsoscelesTriangle(),
        "obtuse": new ObtuseTriangle()
    };

    render() {
        const type: BubbleType = new BaseType(SpeechBubble.styles["isosceles"]);
        const { containerStyle, quoteStyle, trianglePosition, beforeTriangleStyle, afterTriangleStyle } = type;
        const { text, cite } = this.props;
        console.log(type);
        return (
            <div style={containerStyle}>
                <blockquote style={quoteStyle}>
                    <p>{text}</p>
                    {(cite) ? <cite>{cite}</cite> : undefined}
                </blockquote>
                <div style={trianglePosition} >
                    <div style={beforeTriangleStyle} />
                    <div style={afterTriangleStyle} />
                </div>
            </div>
        );
    }
}

export default SpeechBubble;