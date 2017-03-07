import * as React from "react";

import AmazonEchoIcon from "../../../components/Icon/AmazonEcho";
import DefaultIcon from "../../../components/Icon/Default";
import GoogleHomeIcon from "../../../components/Icon/GoogleHome";
import { Origin } from "../../../models/conversation";

interface ConvoIconProps {
    origin: Origin;
    color: string;
    style?: React.CSSProperties;
    tooltip?: string;
    onClick?: () => void;
}

interface ConvoIconState {

}

export class ConvoIcon extends React.Component<ConvoIconProps, ConvoIconState> {
    static defaultProps: ConvoIconProps = {
        origin: Origin.AmazonAlexa,
        color: "#FFFFFF",
    };

    render() {
        let { origin, ...others } = this.props;

        let icon: JSX.Element;

        switch (origin) {
            case Origin.GoogleHome:
                icon = (
                    <GoogleHomeIcon
                        {...others} />
                );
                break;

            case Origin.AmazonAlexa:
                icon = (
                    <AmazonEchoIcon
                        {...others} />
                );
                break;

            default:
                icon = (
                    <DefaultIcon
                        {...others} />
                );
        }
        return icon;
    }
}

export default ConvoIcon;