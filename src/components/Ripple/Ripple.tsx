import * as React from "react";

import MDLComponent from "../MDLComponent";

interface RippleProps {
    readonly className?: string;
    readonly style?: React.CSSProperties;
}

export class Ripple extends MDLComponent<RippleProps, any> {

    render() {
        let myClasses = "mdl-ripple";
        if (this.props.className) {
            myClasses += " " + this.props.className;
        }
        return (<span className={myClasses} />);
    }
}

export default Ripple;