import * as classNames from "classnames";
import * as React from "react";

const Theme = require("./theme.scss");

interface SpeechBubbleProps {
    text: string;
}

interface SpeechBubbleState {

}

export class SpeechBubble extends React.Component<SpeechBubbleProps, SpeechBubbleState> {
    render() {
        console.info("Speech bubble");
        console.log(Theme);
        const containerClass = classNames(Theme["content"]);
        const quoteClass = classNames(Theme["triangle-obtuse"]);
        return (
            <div className={containerClass}>
                <blockquote className={quoteClass}>
                    <p>Simple can be harder than complex: You have to work hard to get your thinking clean to make it simple. But it’s worth it in the end because once you get there, you can move mountains.</p>
                    <cite> - Steve Jobs </cite>
                </blockquote>
            </div>
        );
    }
}

export default SpeechBubble;