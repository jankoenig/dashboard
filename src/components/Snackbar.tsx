import * as classNames from "classnames";
import * as React from "react";

export interface SnackbarProps {
    readonly text: string;
};

interface SnackbarState {
    // the internal state for showing or hiding is for
    // when the user dismisses the snackbar manually
    readonly show: boolean;
}

export default class Snackbar extends React.Component<SnackbarProps, SnackbarState> {
    constructor(props: SnackbarProps) {
        super(props);

        this.state = {
            show: this.shouldShowSnackbar(props)
        };

        this.hideSnackBar = this.hideSnackBar.bind(this);
    }

    componentWillReceiveProps(nextProps: SnackbarProps) {
        this.setState({
            show: this.shouldShowSnackbar(nextProps)
        });
    }

    shouldShowSnackbar(props: SnackbarProps): boolean {
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
                <button className="mdl-snackbar__action" type="button" onClick={this.hideSnackBar}>Close</button>
            </div>
        );
    }
}
