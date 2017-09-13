import * as React from "react";

export class CodeSheet extends React.Component<any, any> {
    static codeStyle: React.CSSProperties = {
        padding: "10px",
        backgroundColor: "#CFD8DC",
        color: "#263238",
        overflowX: "auto",
        fontSize: "14px"
    };

    render() {
        return (
            <pre style={CodeSheet.codeStyle}>{this.props.children}</pre>
        );
    }
}
