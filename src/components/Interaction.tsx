import * as React from "react";
import JSONTree from "react-json-tree";

import CopyToClipboardButton from "../components/CopyToClipboardButton";
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

    static getKey(keyName: string[]): string {
        return keyName.join(",");
    }

    static getJSONTreeStyle(): React.CSSProperties {
        return {
            padding: "15px",
            borderRadius: "10px",
            borderStyle: "solid"
        };
    }

    static getHeaderWrapperStyle(): React.CSSProperties {
        return {
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
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
            <span>
                <div style={Interaction.getHeaderWrapperStyle()}>
                    <h6>REQUEST</h6>
                    <CopyToClipboardButton text={JSON.stringify(this.props.request.payload, undefined, 2)} />
                </div>
                {this.getTree(this.props.request)}
                <h6>LOGS</h6>
                <OutputList outputs={this.props.outputs} stackTraces={this.props.stackTraces} />
                <div style={Interaction.getHeaderWrapperStyle()}>
                    <h6>RESPONSE</h6>
                    <CopyToClipboardButton text={JSON.stringify(this.props.response.payload, undefined, 2)} />
                </div>
                {this.getTree(this.props.response)}
            </span>
        );
    }
}

export default Interaction;