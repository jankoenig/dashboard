import * as React from "react";

import Noop from "../utils/Noop";

export type VISIBLITY_STATE = "hidden" | "visible";

interface VisibilityWatcherProps {
    style?: React.CSSProperties;
    onChange?: (visibilityState: VISIBLITY_STATE) => void;
}

interface VisibilityWatcherState {
    isVisible: boolean;
}

export class VisibilityWatcher extends React.Component<VisibilityWatcherProps, VisibilityWatcherState> {

    static defaultProps = {
        onChange: Noop
    };

    constructor(props: VisibilityWatcherProps) {
        super(props);
        this.state = {
            isVisible: false
        };

        this.onVisibilityChange = this.onVisibilityChange.bind(this);
    }

    componentDidMount() {
        if (document) {
            document.addEventListener("visibilitychange", this.onVisibilityChange);
        }
    }

    componentWillUnmount() {
        if (document) {
            document.removeEventListener("visibilitychange", this.onVisibilityChange);
        }
    }

    onVisibilityChange() {
        if (document) {
            this.props.onChange(document.visibilityState as VISIBLITY_STATE);
        }
    }

    render() {
        return (<div style={this.props.style}> {this.props.children} </div>);
    }
}

export default VisibilityWatcher;