import * as Clipboard from "clipboard";
import * as React from "react";
import FontIcon from "react-toolbox/lib/font_icon";

const style = require("./style.scss");

interface CopyToClipboardButtonProps {
    text: string;
    style?: React.CSSProperties;
}

interface CopyToClipboardButtonState {
    icon: string;
}

export default class CopyToClipboardButton extends React.Component<CopyToClipboardButtonProps, CopyToClipboardButtonState> {

    private root: Element;

    private clipboard: Clipboard;

    private iconTimer: NodeJS.Timer | WindowTimers | number;

    constructor(props: CopyToClipboardButtonProps) {
        super(props);

        this.state = {
            icon: "content_copy"
        };

        this.onRef = this.onRef.bind(this);
        this.onSuccess = this.onSuccess.bind(this);
    }

    onRef(ref: Element) {
        this.root = ref;
    }

    onSuccess() {
        this.state.icon = "done";
        this.setState(this.state);

        this.iconTimer = setTimeout(() => {
            this.state.icon = "content_copy";
            this.setState(this.state);
        }, 1500);
    }

    componentWillUnmount() {
        this.clipboard && this.clipboard.destroy();
    }

    componentDidMount() {
        this.clipboard = new Clipboard(this.root, {
            text: (): string => {
                return this.props.text;
            }
        });
        this.clipboard.on("success", this.onSuccess);
    }

    render() {
        return (
            <div
                style={this.props.style}
                className={style.button}
                ref={this.onRef}>
                <FontIcon className={style.icon} value={this.state.icon} />
            </div>
        );
    }
}