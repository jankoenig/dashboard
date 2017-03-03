import * as moment from "moment";
import * as React from "react";

const DEFAULT_FORMAT = "MMM Do, h:mm:ss a";

interface TimeTextProps {
    timestamp: Date;
    style?: React.CSSProperties;
}

class TimeTextComponent extends React.Component<TimeTextProps, any> {
    render() {
        const time = moment(this.props.timestamp);
        return (
            <span
                style={this.props.style}>
                {time.format(DEFAULT_FORMAT)}
                <span
                    style={{ color: "#BDBDBD", paddingLeft: "5px" }}>
                    {time.fromNow()}
                </span>
            </span>
        );
    }
}

export default TimeTextComponent;