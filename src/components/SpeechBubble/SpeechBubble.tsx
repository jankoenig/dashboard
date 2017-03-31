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
        color: "#000",
        borderRadius: "10px",
        background: "#f3961c"
    };

    trianglePosition: React.CSSProperties = {
        display: "block", /* reduce the damage in FF3.0 */
        position: "absolute",
        left: "60px",
    };

    beforeTriangleStyle: React.CSSProperties = {
        position: "absolute",
        content: "",
        width: 0,
    };

    afterTriangleStyle: React.CSSProperties = {
        position: "absolute",
        content: "",
        width: 0
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
    afterTriangleStyle = {
        content: "",
        width: 0,
        borderWidth: "15px 15px 0",
        borderStyle: "solid",
        borderColor: "#f3961c transparent"
    };
}

class ObtuseTriangle extends NoChange {
    quoteStyle = {
        color: "#fff",
        background: "#c81e2b"
    };

    trianglePosition = {
        left: "60px",
    };

    beforeTriangleStyle = {
        border: 0,
        borderRightWidth: "50px",
        borderBottomWidth: "60px",
        borderStyle: "solid",
        borderColor: "transparent #c81e2b",
    };

    afterTriangleStyle = {
        left: "30px",
        border: 0,
        borderRightWidth: "20px",
        borderBottomWidth: "60px",
        borderStyle: "solid",
        borderColor: "transparent #fff",
    };
}

class BorderTriangle extends NoChange {
    quoteStyle = {
        border: "10px solid #5a8f00",
        color: "#333",
        borderRadius: "30px",
        background: "#fff"
    };

    beforeTriangleStyle = {
        border: 0,
        borderRightWidth: "60px",
        borderBottomWidth: "50px",
        borderStyle: "solid",
        borderColor: "transparent #5a8f00"
    };

    afterTriangleStyle = {
        bottom: "-25px",
        left: "5px",
        border: 0,
        borderRightWidth: "45px",
        borderBottomWidth: "40px",
        borderStyle: "solid",
        borderColor: "transparent #fff"
    };
}

export class SpeechBubble extends React.Component<SpeechBubbleProps, SpeechBubbleState> {

    private static styles: any = {
        "isosceles": new IsoscelesTriangle(),
        "obtuse": new ObtuseTriangle(),
        "border": new BorderTriangle()
    };

    render() {
        const type: BubbleType = new BaseType(SpeechBubble.styles["isosceles"]);
        const { containerStyle, quoteStyle, trianglePosition, beforeTriangleStyle, afterTriangleStyle } = type;
        const { text, cite } = this.props;
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