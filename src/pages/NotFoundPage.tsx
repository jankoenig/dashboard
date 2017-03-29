import * as React from "react";

import SpeechBubble from "../components/Icon/SpeechBubbleIcon";

const centerStyle = {
    margin: "auto",
    width: "50%",
    padding: "10px"
};

export default class NotFoundPage extends React.Component<any, any> {
    render() {
        return (
            <div>
                <h1 style={{ ...centerStyle, ...{ textAlign: "center" } }}>404</h1>
                <div style={{ ...centerStyle, ...{ position: "relative" } }}>
                    <SpeechBubble style={{ height: "auto" }} />
                    <h4 style={{
                        position: "absolute",
                        margin: "5rem",
                        fontSize: "4.5em",
                        lineHeight: "1em",
                        top: "0", left: "0", right: "0", bottom: "0"
                    }}>It seems we can not find the requested page you are looking for.</h4>
                </div>
            </div >
        );
    }
}
