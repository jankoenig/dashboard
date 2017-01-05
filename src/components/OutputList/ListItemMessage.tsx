import * as moment from "moment";
import * as React from "react";

interface ListItemMessageProps {
    timestamp: Date | moment.Moment;
    level: string;
    message: string;
    levelColor?: string;
    messageColor?: string;
}

export const DEFAULT_TIME_FORMAT = "hh:mm:ss.SSSSS";

export class ListItemMessage extends React.Component<ListItemMessageProps, any> {


    static style(): React.CSSProperties {
        return {
            color: "white",
            margin: "5px",
            overflow: "hidden"
        };
    }

    render() {

        const { level, message, timestamp, levelColor, messageColor } = this.props;

        let formattedTime = moment(timestamp).format(DEFAULT_TIME_FORMAT);

        return (
            <div style={ListItemMessage.style()}>
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