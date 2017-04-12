import * as React from "react";
import { Link } from "react-router-dom";

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
                <div style={{ ...centerStyle, ...{ position: "relative" } }}>
                    <Speech text="It seems we can not find the requested page."
                        style="border"
                        modifiers={{ color: "#000" }}
                        textStyle={{ fontSize: "5vw", lineHeight: "5vw", margin: "3vw"}} />
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
