import * as React from "react";

import { IconButton } from "react-toolbox/lib/button";
import Tooltip from "react-toolbox/lib/tooltip";

const IconTheme = require("./default-theme.scss");

const TooltipButton = Tooltip(IconButton);

interface AmazonEchoProps {
    readonly theme?: string;
    readonly style?: React.CSSProperties;
    readonly tooltip?: string;
    readonly width?: string;
    readonly height?: string;
    readonly color?: string;
    readonly onClick?: () => void;
}

export default class AmazonEcho extends React.Component<AmazonEchoProps, any> {

    static defaultProps: AmazonEchoProps = {
        theme: IconTheme,
        width: "83px",
        height: "83px",
        color: "#FFFFFF"
    };

    render() {
        let { style, theme, onClick, tooltip, ...iconProps } = this.props;
        return (
            <TooltipButton
                style={style}
                theme={theme}
                onClick={onClick}
                tooltip={tooltip}
                icon={<Icon
                    {...iconProps} />} />
        );
    }
}

export class Icon extends React.Component<AmazonEchoProps, any> {

    // tslint:disable
    render() {
        return (
            <svg {...this.props}  viewBox="-1 0 84 83" preserveAspectRatio="xMinYMin" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <path id="Shape" stroke="none" fill={this.props.color} fillRule="nonzero" d="M3,0.36223 C1.3344,0.35133 -0.0003001,1.89915 -9.99999914e-08,3.36219 L-9.99999914e-08,79.3622 C0.0001999,80.933 1.4293,82.3621 3,82.3622 L79,82.3622 C80.5708,82.3621 81.9998,80.933 82,79.3622 L82,3.36219 C81.9998,1.79148 80.5708,0.36239 79,0.36223 L3,0.36223 L3,0.36223 Z M6,6.36219 L76,6.36219 L76,76.3622 L6,76.3622 L6,6.36219 L6,6.36219 Z M41,13.36219 C32.6304,13.36219 25.7915,18.81379 24.0938,25.61219 C23.7827448,26.6672822 24.0739172,27.8080238 24.852575,28.584883 C25.6312328,29.3617422 26.7725136,29.6501452 27.8266733,29.336441 C28.880833,29.0227368 29.6788308,28.1572298 29.9062,27.08099 C30.818,23.43049 35.3559,19.36219 41,19.36219 C43.7804,19.36219 46.6925,20.38319 48.75,22.04969 C50.8076,23.71619 52,25.86219 52,28.36219 C52,31.64549 51.3312,33.11939 50.4375,34.26849 C49.5439,35.41769 48.1152,36.31109 46.25,37.64349 C44.3848,38.97599 42.1693,40.8156 40.5625,43.7997 C38.956,46.7838 38,50.7789 38,56.3622 C38.0000001,58.0193089 39.3431458,59.3626611 41,59.3626611 C42.6568542,59.3626611 43.9999999,58.0193089 44,56.3622 C44,51.4455 44.8257,48.5346 45.8438,46.6435 C46.8618,44.7527 48.1157,43.7172 49.75,42.5497 C51.3842,41.3822 53.4566,40.1818 55.1875,37.95599 C56.9185,35.73019 58,32.57889 58,28.36219 C58,23.86219 55.6896,19.97709 52.5,17.39349 C49.3102,14.80999 45.2105,13.36219 41,13.36219 L41,13.36219 Z M41.031,61.3622 C38.8201,61.3622 36.9998,63.1531 36.9998,65.3622 C36.9998,67.5713 38.8202,69.3622 41.031,69.3622 C43.2418,69.3622 45.031,67.5713 45.031,65.3622 C45.031,63.1531 43.2417,61.3622 41.031,61.3622 L41.031,61.3622 Z"></path>
            </svg>
        )
    }
}
// tslint:enable