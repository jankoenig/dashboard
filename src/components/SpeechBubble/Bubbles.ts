export type BubbleStyle = "isosceles" | "obtuse" | "border";

export interface Modifiers {
    color?: string;
}

export function getType(type: BubbleStyle, modifiers?: Modifiers) {
    switch (type) {
        case "obtuse":
            return new BaseType(new ObtuseTriangle(modifiers));
        case "border":
            return new BaseType(new BorderTriangle(modifiers));
        case "isosceles":
        default:
            return new BaseType(new IsoscelesTriangle(modifiers));
    }
}

export interface BubbleType {
    containerStyle: React.CSSProperties;
    quoteStyle: React.CSSProperties;
    trianglePosition: React.CSSProperties;
    beforeTriangleStyle: React.CSSProperties;
    afterTriangleStyle: React.CSSProperties;
}

export class BaseType implements BubbleType {
    containerStyle: React.CSSProperties = {
        position: "relative",
        display: "inline-block",
        zIndex: 1
    };

    quoteStyle: React.CSSProperties = {
        position: "relative",
        paddingLeft: "2vw",
        paddingRight: "2vw",
        paddingTop: "3vh",
        paddingBottom: "3vh",
        color: "#000",
        borderRadius: "3vw",
        background: "#f3961c"
    };

    trianglePosition: React.CSSProperties = {
        display: "block", /* reduce the damage in FF3.0 */
        position: "absolute",
        left: "7vw",
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
    static defaultModifiers: Modifiers = {};

    static getDefaultModifier() {
        return this.defaultModifiers;
    }

    modifiers: Modifiers;

    containerStyle: React.CSSProperties = {};
    quoteStyle: React.CSSProperties = {};
    trianglePosition: React.CSSProperties = {};
    beforeTriangleStyle: React.CSSProperties = {};
    afterTriangleStyle: React.CSSProperties = {};

    constructor(modifiers: Modifiers = {}) {
        const defaultModifier = (this.constructor as typeof NoChange).defaultModifiers;
        this.modifiers = { ...defaultModifier , ...modifiers };
    }
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
    static defaultModifiers: Modifiers = {
        color: "#5a8f00"
    };

    quoteStyle = {
        border: "1vw solid " + this.modifiers.color,
        color: "#333",
        background: "#fff"
    };

    beforeTriangleStyle = {
        border: 0,
        borderRightWidth: "4vw",
        borderBottomWidth: "4vw",
        borderStyle: "solid",
        borderColor: "transparent " + this.modifiers.color
    };

    afterTriangleStyle = {
        bottom: "-1.4vw",
        left: "0.5vw",
        border: 0,
        borderRightWidth: "2.6vw",
        borderBottomWidth: "2.6vw",
        borderStyle: "solid",
        borderColor: "transparent #fff"
    };
}