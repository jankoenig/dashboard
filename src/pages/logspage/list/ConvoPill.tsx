import * as React from "react";

import Pill from "../../../components/Pill";

interface PillProps {
    show: boolean;
    text: string;
}

class ConvoPill extends React.Component<PillProps, any> {
    render() {
        let { show, text } = this.props;
        if (show) {
            return (
                <Pill>
                    {text}
                </Pill>
            );
        } else {
            return (<div/>);
        }
    }
}

export default ConvoPill;