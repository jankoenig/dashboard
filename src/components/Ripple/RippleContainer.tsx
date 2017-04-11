import * as React from "react";

import MDLComponent from "../MDLComponent";

export interface RippleContainerProps {
    readonly className?: string;
    readonly style?: React.CSSProperties;
}

/**
 * Keeping the items cached in style so they're not calculated on every render.
 */
interface RippleContainerState {
    readonly myClasses: string;
    readonly myStyle: React.CSSProperties;
}

/**
 * A Div wrapper that can hold a Ripple component.  Basic usage is like this:
 *
 * <RippleContainer>
 *  <Ripple/>
 * </RippleContainer>
 *
 * It can be styled any possible way. The ripple will expand to the entire div.
 */
export class RippleContainer extends MDLComponent<RippleContainerProps, RippleContainerState> {

    constructor(props: RippleContainerProps) {
        super(props);
        this.state = this.newProps(props);
    }

    componentWillReceiveProps(nextProps: RippleContainerProps, context: any) {
        this.setState(this.newProps(nextProps));
    }

    newProps(props: RippleContainerProps): RippleContainerState {
        let classes = "mdl-js-ripple-effect";
        if (props.className) {
            classes += " " + props.className;
        }

        let myStyle: React.CSSProperties = { cursor: "pointer", overflow: "hidden", position: "relative" };
        let theirStyle: React.CSSProperties = props.style || {};
        let ourStyle = { ...myStyle, ...theirStyle };

        return {
            myClasses: classes,
            myStyle: ourStyle
        };
    }

    render() {
        return (
            <div className={this.state.myClasses} style={this.state.myStyle}>
                {this.props.children}
            </div>
        );
    }
}

export default RippleContainer;