import { OutputList } from "../components/OutputList";
import Log from "../models/log";
import Output from "../models/output";
import * as React from "react";
import JSONTree from "react-json-tree";

interface InteractionProps {
    request: Log;
    response: Log;
    outputs: Output[];
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
            borderStyle: "solid",
            borderWidth: "2px",
            borderColor: this.monokaiTheme.base0B
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
        // don't expand the really long nodes by default
        if (keyName.indexOf("user") > -1 || keyName.indexOf("application") > -1) {
            return false;
        }
        return true;
    }

    getTree(log: Log): JSX.Element {
        let tree: JSX.Element;
        if (log) {
            tree = (
                <JSONTree
                    data={log.payload}
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
        return (<div>
                    <h6>REQUEST</h6>
                        {this.getTree(this.props.request)}
                    <h6>CONSOLE</h6>
                        <OutputList outputs={this.props.outputs} />
                    <h6>RESPONSE</h6>
                        {this.getTree(this.props.response)}
                </div>);
    }
}

export default Interaction;