import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { removeToast } from "../../actions/toast";
import { State } from "../../reducers";
import Toast, {ToastProps} from "./Toast";

let toastTheme = require("./Toast-theme.scss");

const Toasts = (props: any) => {
    const { removeToast } = props.actions;
    return (
        <ul className={toastTheme.toasts}>
            {props.toasts && props.toasts.map((toast: ToastProps) => {
                const { id, onToastClick, ...others } = toast;
                const removeToastFunction = () => {
                    onToastClick();
                    removeToast(id);
                };
                const closeToastFunction = () => {
                    removeToast(id);
                }
                return (
                    <Toast {...others} key={id} onToastClick={removeToastFunction} onCloseToast={closeToastFunction} />
                );
            })}
        </ul>
    );
};

const mapDispatchToProps = (dispatch: any) => ({
    actions: bindActionCreators({ removeToast }, dispatch)
});

const mapStateToProps = (state: State.All) => ({
    toasts: state.toasts
});

export default connect(mapStateToProps, mapDispatchToProps)(Toasts);
