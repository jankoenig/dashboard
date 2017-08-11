import * as React from "react";

import Pill from "../../../components/Pill";

interface PillProps {
    show: boolean;
    text: string;
    style?: React.CSSProperties;
}

class ConvoPill extends React.Component<PillProps, any> {
    render() {
        let { show, text } = this.props;
        if (show) {
            return (
                <Pill style={this.props.style}>
                    {text}
                </Pill>
            );
        } else {
            return (<div/>);
        }
    }
}

export default ConvoPill;
