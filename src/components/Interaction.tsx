import * as React from "react";
import JSONTree from "react-json-tree";

import { IconButton } from "react-toolbox/lib/button";
import { OutputList } from "../components/OutputList";
import Log from "../models/log";
import Output from "../models/output";
import StackTrace from "../models/stack-trace";

interface InteractionProps {
    request: Log;
    response: Log;
    outputs: Output[];
    stackTraces: StackTrace[];
    theme?: any;
}

interface InteractionState {
    openBranches: any;
}

export class Interaction extends React.Component<InteractionProps, InteractionState> {
    /**
     * JSONTree uses base16 style
     * For more info read http://chriskempson.com/projects/base16/
     * and themes http://chriskempson.github.io/base16/
     */
    static monokaiTheme = {
        scheme: "monokai",
        author: "wimer hazenberg (http://www.monokai.nl)",
        base00: "#272822",
        base01: "#383830",
        base02: "#49483e",
        base03: "#75715e",
        base04: "#a59f85",
        base05: "#f8f8f2",
        base06: "#f5f4f1",
        base07: "#f9f8f5",
        base08: "#f92672",
        base09: "#fd971f",
        base0A: "#f4bf75",
        base0B: "#a6e22e",
        base0C: "#a1efe4",
        base0D: "#66d9ef",
        base0E: "#ae81ff",
        base0F: "#cc6633"
    };

    static titleContainerStyle: React.CSSProperties = {
        position: "relative"
    };

    static titleStyle: React.CSSProperties = {
        position: "absolute",
        margin: "0 15px",
        color: "#fff",
        top: 8,
        right: 0,
    };

    static requestIconStyle: React.CSSProperties = {
        position: "absolute",
        color: "#fff",
        top: -5,
        right: 80,
        cursor: "copy",
    };

    static responseIconStyle: React.CSSProperties = {
        position: "absolute",
        color: "#fff",
        top: -5,
        right: 92,
        cursor: "copy",
    };

    static getKey(keyName: string[]): string {
        return keyName.join(",");
    }

    static getJSONTreeStyle() {
        return {
            padding: "15px",
            borderRadius: "10px",
            borderStyle: "solid",
        };
    }

    static defaultProps = {
        theme: {
            extend: Interaction.monokaiTheme,
            tree: Interaction.getJSONTreeStyle()
        }
    };

    constructor(props: InteractionProps) {
        super(props);

        this.shouldExpandNode = this.shouldExpandNode.bind(this);
        this.handleToggle = this.handleToggle.bind(this);
        this.handleCopyRequestPayload = this.handleCopyPayload.bind(this);
        this.handleCopyResponsePayload = this.handleCopyPayload.bind(this);
        this.handleCopyPayload = this.handleCopyPayload.bind(this);

        this.state = {
            openBranches: { "request": true, "response": true }
        };
    }

    setOpenBranch(isExpanded: boolean, key: string) {
        this.state.openBranches[key] = isExpanded;
        this.setState(this.state);
    }

    handleToggle(isExpanded: boolean, keyName: string[], data: any, level: number): string {
        const key = Interaction.getKey(keyName);
        this.setOpenBranch(isExpanded, key);
        return key;
    }

    handleCopyRequestPayload: (e: any) => void;
    handleCopyResponsePayload: (e: any) => void;
    handleCopyPayload(e: any) {
        const payload = e.target.getAttribute("data-type") === "request" ? this.props.request : this.props.response;
        const textArea = document.createElement("textarea");
        textArea.style.position = "fixed";
        textArea.style.top = "0";
        textArea.style.left = "0";
        // Ensure it has a small width and height. Setting to 1px / 1em
        // doesn't work as this gives a negative w/h on some browsers.
        textArea.style.width = "2em";
        textArea.style.height = "2em";
        // We don't need padding, reducing the size if it does flash render.
        textArea.style.padding = "0";
        // Clean up any borders.
        textArea.style.border = "none";
        textArea.style.outline = "none";
        textArea.style.boxShadow = "none";
        // Avoid flash of white box if rendered for any reason.
        textArea.style.background = "transparent";
        // get value as pretty json string
        textArea.value = JSON.stringify(payload, undefined, 2);
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand("copy");
        } catch (err) {
            console.log(err);
        }
        document.body.removeChild(textArea);
        e.preventDefault();
        e.stopPropagation();
    }

    shouldExpandNode(keyName: string[], data: any, level: number) {
        const key = Interaction.getKey(keyName);
        return this.state.openBranches[key] === true;
    }

    getTree(log: Log): JSX.Element {
        let tree: JSX.Element;
        if (log) {
            const payload = (typeof log.payload === "object") ? log.payload : { message: log.payload };
            tree = (
                <JSONTree
                    data={payload}
                    hideRoot={true}
                    invertTheme={false}
                    theme={this.props.theme}
                    shouldExpandNode={this.shouldExpandNode}
                    onToggle={this.handleToggle} />
            );
        } else {
            tree = (<p>Select a conversation or message to inspect the payload</p>);
        }

        return tree;
    }

    render() {
        return (
            <div>
                <div style={Interaction.titleContainerStyle}>
                    <h6 style={Interaction.titleStyle}>REQUEST</h6>
                    <IconButton data-type="request" onClick={this.handleCopyRequestPayload} icon="library_add" style={Interaction.requestIconStyle} />
                </div>
                {this.getTree(this.props.request)}
                <div style={Interaction.titleContainerStyle}>
                    <h6 style={Interaction.titleStyle}>RESPONSE</h6>
                    <IconButton data-type="response" onClick={this.handleCopyResponsePayload} icon="library_add" style={Interaction.responseIconStyle} />
                </div>
                {this.getTree(this.props.response)}
                <div style={Interaction.titleContainerStyle}>
                    <h6 style={Interaction.titleStyle}>LOGS</h6>
                </div>
                <OutputList outputs={this.props.outputs} stackTraces={this.props.stackTraces} />
            </div>
        );
    }
}

export default Interaction;
