import * as classNames from "classnames";
import * as React from "react";

export interface SnackBarProps {
    text: string;
};

interface SnackBarState {
    // the internal state for showing or hiding is for
    // when the user dismisses the snackbar manually
    show: boolean;
}

export default class SnackBar extends React.Component<SnackBarProps, SnackBarState> {
    constructor(props: SnackBarProps) {
        super(props);

        this.state = {
            show: this.shouldShowSnackbar(props)
        };
    }

    componentWillReceiveProps(nextProps: SnackBarProps) {
        this.setState({
            show: this.shouldShowSnackbar(nextProps)
        });
    }

    shouldShowSnackbar(props: SnackBarProps): boolean {
        let showSnackbar = false;

        if (props.text && props.text.length > 0) {
            showSnackbar = true;
        }

        return showSnackbar;
    }

    hideSnackBar() {
        this.setState({
            show: false
        });
    }

    classes() {
        return classNames("mdl-js-snackbar mdl-snackbar", {
            "mdl-snackbar--active": this.state.show
        });
    }

    render() {
        return (
            <div className={this.classes()}>
                <div className="mdl-snackbar__text">{this.props.text}</div>
                <button className="mdl-snackbar__action" type="button" onClick={this.hideSnackBar.bind(this)}>Close</button>
            </div>
        );
    }
}
