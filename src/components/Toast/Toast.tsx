import * as classNames from "classnames";
import * as React from "react";

import "./Toast-theme.scss";

export interface ToastProps {
    id?: number;
    message?: string;
    type?: "error" | "info" | "warning" | "success";
    style?: React.CSSProperties;
    className?: string;
    onShowToast?: (property: any) => void;
    duration?: number;
    direction?: string;
    onToastClick?: () => void;
    actionType?: string;
    closeOnClick?: boolean;
}

interface ToastState {
    hide: boolean;
}

export class Toast extends React.Component<ToastProps, ToastState> {
    static defaultProps = {
        message: "",
        type: "error",
        duration: 5000,
        closeOnClick: true,
        direction: "top",
    };

    constructor(props: any) {
        super(props);

        this.setState({hide: false});

        this.handleClick = this.handleClick.bind(this);
    }

    classes() {
        return classNames("custom-toast", {
            [this.props.type]: !!this.props.type,
            [this.props.direction]: !!this.props.direction,
            "end": this.state && this.state.hide,
        });
    }

    handleClick() {
        this.props && this.props.onToastClick && this.props.onToastClick();
        if (this.props && this.props.closeOnClick) {
            this.setState({...this.state, hide: true});
            this.props && this.props.onShowToast && this.props.onShowToast(this.props.actionType);
        }
    }

    render() {
        setTimeout(() => {
            this.props && this.props.onShowToast && this.props.onShowToast(this.props.actionType);
        }, this.props.duration);
        return (
            <div onClick={this.handleClick} style={this.props.style} className={this.classes()}>
                {this.props.message}
            </div>
        );
    }
}

export default Toast;
