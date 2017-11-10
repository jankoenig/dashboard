import * as classNames from "classnames";
import * as React from "react";

import "./Toast-theme.scss";

interface ToastProps {
    message?: string;
    type?: "error" | "info" | "warning" | "success";
    style?: React.CSSProperties;
    className?: string;
    onShowToast?: (property: any) => void;
    duration?: number;
    onToastClick?: () => void;
}

interface ToastState {
}

export class Toast extends React.Component<ToastProps, ToastState> {
    static defaultProps = {
        message: "",
        type: "error",
        duration: 5000,
    };

    constructor(props: any) {
        super(props);
    }

    classes() {
        return classNames("custom-toast", {
            [this.props.type]: !!this.props.type,
        });
    }

    render() {
        setTimeout(() => {
            this.props && this.props.onShowToast;
        }, this.props.duration);
        return (
            <div onClick={this.props.onToastClick} style={this.props.style} className={this.classes()}>
                {this.props.message}
            </div>
        );
    }
}

export default Toast;
