import * as React from "react";

const HIDDEN_KEY_MESSAGE = "<SECRET_KEY>";

export interface IntegrationSubPageProps {
    secretKey?: string;
}

export interface IntegrationSubPageState {
    secretText: string;
}

export abstract class IntegrationSubPage<P extends IntegrationSubPageProps, S extends IntegrationSubPageState> extends React.Component<P, S> {

    constructor(props: P, initialState: S) {
        super(props);

        const initState: any = (initialState) ? {} : undefined;
        this.state = { ...initState, ...{ secretText: HIDDEN_KEY_MESSAGE }};

        this.handleRevealClick = this.handleRevealClick.bind(this);
    }

    handleRevealClick() {
        if (this.props.secretKey) {
            if (this.state.secretText === HIDDEN_KEY_MESSAGE) {
                this.state.secretText = this.props.secretKey;
            } else {
                this.state.secretText = HIDDEN_KEY_MESSAGE;
            }

            this.setState(this.state);
        }
    }
}

export class CodeSheet extends React.Component<any, any> {
    static codeStyle: React.CSSProperties = {
        margin: "10px",
        padding: "20px",
        backgroundColor: "#CFD8DC",
        color: "#263238",
        whiteSpace: "pre-line"
    };

    render() {
        return (
            <pre style={CodeSheet.codeStyle} >
                {this.props.children}
            </pre>
        )
    }
}