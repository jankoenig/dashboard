import * as React from "react";
import JSONTree from "react-json-tree";

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

export class Interaction extends React.Component<InteractionProps, any> {
    /**
     * JSONTree uses base16 style
     * For more info read http://chriskempson.com/projects/base16/
     * and themes http://chriskempson.github.io/base16/
     */
    monokaiTheme = {
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

    getJSONTreeStyle() {
        return {
            padding: "15px",
            borderRadius: "10px",
            borderStyle: "solid"
        };
    }

    getTheme() {
        return this.props.theme ?
            this.props.theme :
            {
                extend: this.monokaiTheme,
                tree: this.getJSONTreeStyle()
            };
    }

    shouldExpandNode(keyName: string[], data: any, level: number) {
        // only expand the initial node, request and response by default
        if (keyName.length === 0 || keyName.indexOf("request") > -1 || keyName.indexOf("response") > -1) {
            return true;
        }
        return false;
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
                    theme={this.getTheme()}
                    shouldExpandNode={this.shouldExpandNode} />
            );
        } else {
            tree = (<p>Select a conversation or message to inspect the payload</p>);
        }

        return tree;
    }

    render() {
        return (
            <div>
                <h6>REQUEST</h6>
                {this.getTree(this.props.request)}
                <h6>LOGS</h6>
                <OutputList outputs={this.props.outputs} stackTraces={this.props.stackTraces} />
                <h6>RESPONSE</h6>
                {this.getTree(this.props.response)}
            </div>
        );
    }
}

export default Interaction;