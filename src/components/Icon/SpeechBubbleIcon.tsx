import * as React from "react";

const Theme = require("./speech-bubble-theme.scss");

interface SpeechBubbleProps {
    theme?: string;
    style?: React.CSSProperties;
    color?: string;
}

export default class SpeechBubbleHome extends React.Component<SpeechBubbleProps, any> {
    static defaultProps: SpeechBubbleProps = {
        theme: Theme,
        style: {
            width: "85px",
        },
        color: "#FFFFFF"
    };

    render() {
        let { style, theme } = this.props;
        return (
            <div style={style}>
                <div className={theme}>
                    <Icon />
                </div>
            </div>
        );
    }
}

class Icon extends React.Component<SpeechBubbleProps, any> {

    // tslint:disable
    render() {
        return (
            <svg viewBox="0 0 85 58" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <path id="Shape" stroke="none" fill="#000000" fillRule="nonzero"
                    d="M0.9,10.8 L0.9,36.3 C0.9,42.3 5.6,47 11.6,47 L48.8,47 L64.7,57.5 C64.9,57.7 65.1,57.7 65.4,57.7 C65.6,57.7 65.7,57.7 65.8,57.6 C66.3,57.4 66.6,57 66.6,56.5 L66.6,56.3 L64.9,47 L73.9,47 C79.9,47 84.6,42.3 84.6,36.3 L84.6,10.8 C84.6,4.8 79.9,0.1 73.9,0.1 L11.6,0.1 C5.6,0.1 0.9,4.8 0.9,10.8 Z M2.9,10.8 C2.9,5.9 6.7,2.1 11.6,2.1 L73.9,2.1 C78.8,2.1 82.6,5.9 82.6,10.8 L82.6,36.3 C82.6,41.2 78.8,45 73.9,45 L62.5,45 L64.3,54.8 L49.4,45 L11.6,45 C6.7,45 2.9,41.2 2.9,36.3 L2.9,10.8 L2.9,10.8 Z"></path>
            </svg>);
    }
}
// tslint:enable