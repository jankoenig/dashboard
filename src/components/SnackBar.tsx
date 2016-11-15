import * as classNames from "classnames";
import * as React from "react";

export interface SnackBarProps {
    actionText?: string;
    show: boolean;
    snackBarText: string;
};

interface SnackBarState {
    showSnackBar: boolean;
}

export default class SnackBar extends React.Component<SnackBarProps, SnackBarState> {
    constructor(props: SnackBarProps) {
        super(props);
        this.hideSnackBar = this.hideSnackBar.bind(this);
        this.showSnackBar = this.showSnackBar.bind(this);
        this.state = {
            showSnackBar: this.props.show
        };
    }

    componentWillReceiveProps(nextProps: any) {
        if (nextProps.show) {
            this.showSnackBar();
        } else {
            this.hideSnackBar();
        }
    }

    showSnackBar() {
        this.setState({
            showSnackBar: true
        });
    }

    hideSnackBar() {
        this.setState({
            showSnackBar: false
        });
    }

    classes() {
        return classNames("mdl-js-snackbar mdl-snackbar", {
            "mdl-snackbar--active": this.state.showSnackBar
        });
    }

    render() {
        return <div className={this.classes()}>
            <div className="mdl-snackbar__text">{this.props.snackBarText}</div>
            <button className="mdl-snackbar__action" type="button" onClick={this.hideSnackBar}>Close</button>
        </div>;
    }
}
