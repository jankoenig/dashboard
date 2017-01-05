import * as moment from "moment";
import * as React from "react";

export interface StackTraceProps {
    id: string;
    timestamp: Date | moment.Moment;
    level: string;
    message: string;
    levelColor?: string;
    messageColor?: string;
}

export const DEFAULT_TIME_FORMAT = "hh:mm:ss.SSSSS";

export class StackTraceTextItem extends React.Component<StackTraceProps, any> {

    constructor(props: StackTraceProps) {
        super(props);
        this.state = {};
    }

    static defaultProps: StackTraceProps = {
            id: "",
            timestamp: undefined,
            level: "",
            message: "",
            levelColor: "white",
            messageColor: "#EEEEEE"
    };

    static style() {
        return {
            color: "white",
            margin: "5px"
        };
    }

    render() {
        const { id, level, message, timestamp, levelColor, messageColor } = this.props;

        let timestampMoment = moment(timestamp);
        let formattedTime = timestampMoment.format(DEFAULT_TIME_FORMAT);

        return (
            <li key={id} style={StackTraceTextItem.style()}>
                <span style={{ color: "rgb(102, 217, 239)", paddingRight: "10px" }}>
                    {formattedTime}
                </span>
                <span style={{ color: levelColor }}>
                    {level}
                </span>
                <span style={{ paddingLeft: "10px", color: messageColor }}>
                    {message}
                </span>
            </li>
        );
    }
}

export default StackTraceTextItem;