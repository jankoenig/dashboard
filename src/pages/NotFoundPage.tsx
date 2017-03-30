import * as React from "react";
import { Link } from "react-router";

import SpeechBubble from "../components/Icon/SpeechBubbleIcon";
import Speech from "../components/SpeechBubble";

import { Button } from "react-toolbox/lib/button";

const ButtonTheme = require("../themes/button_theme.scss");

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
                <Speech text="It seems we can not find the requested page."/>
                <div style={{ ...centerStyle, ...{ position: "relative" } }}>
                    <SpeechBubble style={{ height: "auto" }} />
                    <h4 style={{
                        position: "absolute",
                        margin: "5rem",
                        fontSize: "5em",
                        lineHeight: "1em",
                        top: "0", left: "0", right: "0", bottom: "0"
                    }}>It seems we can not find the requested page.</h4>
                </div>
                <div style={{ ...centerStyle, ...{ textAlign: "center" } }}>
                    <Link to="/skills/" >
                        <Button theme={ButtonTheme} accent raised label="Go Home" />
                    </Link>
                </div>
            </div >
        );
    }
}
