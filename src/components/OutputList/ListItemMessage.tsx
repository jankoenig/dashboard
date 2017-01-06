import * as moment from "moment";
import * as React from "react";

interface ListItemMessageProps {
    timestamp: Date | moment.Moment;
    level: string;
    message: string;
    levelColor?: string;
    messageColor?: string;
    style?: React.CSSProperties;
    // onClick?: (event: React.MouseEvent) => void;
}

export const DEFAULT_TIME_FORMAT = "hh:mm:ss.SSSSS";

export default class ListItemMessage extends React.Component<ListItemMessageProps, any> {

    style(): React.CSSProperties {
        return {
            color: "white",
            margin: "5px",
            overflow: "hidden",
            ...this.props.style
        };
    }

    render() {

        const { level, message, timestamp, levelColor, messageColor } = this.props;

        let formattedTime = moment(timestamp).format(DEFAULT_TIME_FORMAT);

        return (
            <div style={this.style()} >
                <span style={{ color: "rgb(102, 217, 239)", paddingRight: "10px" }}>
                    {formattedTime}
                </span>
                <span style={{ color: levelColor }}>
                    {level}
                </span>
                <span style={{ paddingLeft: "10px", color: messageColor }}>
                    {message}
                </span>
            </div>
        );
    }
}