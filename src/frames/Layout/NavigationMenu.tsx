import { IconButton } from "react-toolbox/lib/button";
import Tooltip from "react-toolbox/lib/tooltip";

import Noop from "../../utils/Noop";

const IconButtonTheme = require("../../themes/icon-button-primary.scss");

export interface PageButton {
    name: string;
    icon: string | JSX.Element; // String or <svg/>
}

interface NavigationMenuProps {
    pageButtons?: PageButton[];
    onPageSelected?: (button: PageButton) => void | undefined;
}

interface NavigationMenuState {
    buttons: JSX.Element[];
}

const TooltipButton = Tooltip(IconButton);

export default class NavigationMenu extends React.Component<NavigationMenuProps, NavigationMenuState> {

    static defaultProps: NavigationMenuProps = {
        pageButtons: [],
        onPageSelected: Noop
    };

    constructor(props: NavigationMenuProps) {
        super(props);

        this.state = { buttons: [] };
    }

    style: React.CSSProperties = {
        listStyle: "none",
        padding: "0"
    };

    componentWillReceiveProps(props: NavigationMenuProps, context: any) {
        this.buildButtons(props);
    }

    componentWillMount() {
        this.buildButtons(this.props);
    }

    handleSelected(button: PageButton) {
        this.props.onPageSelected(button);
    }

    buildButtons(props: NavigationMenuProps) {
        const buttons = props.pageButtons;
        this.state.buttons = [];
        for (let button of buttons) {
            this.state.buttons.push(
                (
                    <li key={button.name}>
                        <TooltipButton
                            theme={IconButtonTheme}
                            accent
                            key={button.name}
                            tooltip={button.name}
                            tooltipPosition={"horizontal"}
                            icon={button.icon}
                            onClick={this.handleSelected.bind(this, button)} />
                    </li>
                )
            );
        };
    }

    render() {
        return (
            <ul style={this.style}>
                {this.state.buttons}
            </ul>
        );
    }
}