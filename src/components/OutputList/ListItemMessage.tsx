import * as moment from "moment";
import * as React from "react";

interface ListItemMessageProps {
    readonly timestamp: Date | moment.Moment;
    readonly level: string;
    readonly message: string;
    readonly levelColor?: string;
    readonly messageColor?: string;
    readonly style?: React.CSSProperties;
    readonly onClick?: (event: React.MouseEvent) => void;
}

export const DEFAULT_TIME_FORMAT = "hh:mm:ss.SSSSS";

export default class ListItemMessage extends React.Component<ListItemMessageProps, any> {

    static defaultProps: ListItemMessageProps = {
            timestamp: undefined,
            level: "",
            message: "",
            levelColor: "white",
            messageColor: "#EEEEEE"
    };

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
            <div style={this.style()} onClick={this.props.onClick} >
                <span style={{ color: "rgb(102, 217, 239)", paddingRight: "10px" }}>
                    {formattedTime}
                </span>
                <span style={{ color: levelColor }}>
                    {level}
                </span>
                <span style={{ paddingLeft: "10px", color: messageColor }}>
                    {message}
                </span>
                {this.props.children}
            </div>
        );
    }
}