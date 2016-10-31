import * as classNames from "classnames";
// import * as React from "react";
// import { findDOMNode } from "react-dom";

import MDLComponent from "./MDLComponent";

interface ProgressBarProps {
    buffer?: number;
    className?: string;
    indeterminate?: boolean;
    progress?: number;
}

export default class ProgressBar extends MDLComponent<ProgressBarProps, any> {

    componentDidMount() {
        this.setProgress(this.props.progress);
        this.setBuffer(this.props.buffer);
    }

    componentDidUpdate() {
        this.setProgress(this.props.progress);
        this.setBuffer(this.props.buffer);
    }

    setProgress(progress: number) {
        if (!this.props.indeterminate && progress !== undefined) {
            // findDOMNode(this).MaterialProgress.setProgress(progress);
        }
    }

    setBuffer(buffer: number) {
        if (buffer !== undefined) {
            // findDOMNode(this).MaterialProgress.setBuffer(buffer);
        }
    }

    classes() {
        return classNames("mdl-progress mdl-js-progress", {
            "mdl-progress__indeterminate": this.props.indeterminate
        });
    }

    render() {
        return (
            <div className={this.classes()} />
        );
    }
}