import * as React from "react";

import Measure, { Dimensions } from "./Measure";

export type Overflow = "hidden" | "auto" | "visible";

interface ResizingComponentProps {
    overflowY?: Overflow;
}

interface ResizingComponentState {
    dimens: Dimensions;
}

export class ResizingComponent extends React.Component<ResizingComponentProps, ResizingComponentState> {

    static defaultProps: ResizingComponentProps = {
        overflowY: "auto"
    };

    constructor(props: ResizingComponentProps) {
        super(props);

        this.onMeasure = this.onMeasure.bind(this);

        this.state = {
            dimens: { width: 0, height: 0 }
        };
    }

    onMeasure(dimensions: Dimensions) {
        this.setState({ dimens: dimensions });
    }

    render() {
        return (
            <Measure onMeasure={this.onMeasure} >
                <div style={{ overflowY: this.props.overflowY, maxHeight: this.state.dimens.height }} >
                    {this.props.children}
                </div>
            </Measure>
        );
    }
}

export default ResizingComponent;