import * as classNames from "classnames";
import * as React from "react";

let toastTheme = require("./Toast-theme.scss");

export interface ToastProps {
    id?: number;
    message?: string;
    type?: "error" | "info" | "warning" | "success";
    style?: React.CSSProperties;
    className?: string;
    onShowToast?: (property: any) => void;
    duration?: number;
    direction?: "top" | "bottom" | "left" | "right";
    onToastClick?: () => void;
    actionType?: string;
    closeOnClick?: boolean;
    onCloseToast?: () => void;
}

interface ToastState {
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

        this.handleClick = this.handleClick.bind(this);
        this.onCloseModal = this.onCloseModal.bind(this);
    }

    classes() {
        return classNames(toastTheme.custom_toast, {
            [toastTheme[this.props.type]]: !!this.props.type,
            [this.props.direction]: !!this.props.direction,
            [toastTheme[this.props.direction]]: !!this.props.direction,
        });
    }

    handleClick() {
        this.props && this.props.onToastClick && this.props.onToastClick();
    }

    onCloseModal(event: any) {
        event.stopPropagation();
        event.preventDefault();
        this.props.onCloseToast();
    }

    render() {
        setTimeout(() => {
            this.props && this.props.onShowToast && this.props.onShowToast(this.props.actionType);
            this.props && this.props.onCloseToast && this.props.onCloseToast();
        }, (this.props.duration + 2000));
        const duration = (this.props.duration / 1000) + "s";
        return (
            <div onClick={this.handleClick} style={this.props.style} className={this.classes()}>
                <style dangerouslySetInnerHTML={{__html: `
                    .${this.props.direction} {
                        ${this.props.direction}: 0;
                        animation: ${toastTheme["animation-" + this.props.direction]} 2.0s forwards;
                        animation-iteration-count: 1;
                        animation-delay: ${duration};
                    }
                `}} />
                <button className={"mdl-button mdl-js-button mdl-button--icon " + toastTheme.close_button} onClick={this.onCloseModal} >
                    <i className="material-icons">close</i>
                </button>
                {this.props.message}
            </div>
        );
    }
}

export default Toast;
