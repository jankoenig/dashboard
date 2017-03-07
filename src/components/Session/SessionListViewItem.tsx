import * as moment from "moment";
import * as React from "react";

import Session from "../../models/Session";

const style = require("../../themes/session-list-item.scss");

export interface SessionListViewItemProps {
    session: Session;
}

export default class SesssionListViewItem extends React.Component<SessionListViewItemProps, any> {

    render() {
        let startString = moment(this.props.session.start.timestamp).format("MMMM Do YYYY, h:mm:ss a");
        let endString = moment(this.props.session.end.timestamp).format("h:mm:ss a");
        return (
            <li className={style.listItem}>
                <span className={style.sessionContent}>{this.props.session.content} </span>
                <span className={style.duration}>{moment.duration(this.props.session.duration, "seconds").humanize()}</span>
                {this.props.session.launch ? (
                    <div>from Launch</div>
                ) : undefined}
                <div>{this.props.session.userId}</div>
                <div>
                    {startString} - {endString}
                </div>
                <div>
                    {this.props.session.sessions.length} subsessions
                </div>
            </li>
        );
    }
}