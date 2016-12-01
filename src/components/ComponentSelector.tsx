import * as React from "react";

import * as Select from "./Select";

export interface SelectableComponent {
    title: string;
    component: JSX.Element;
};

export interface ComponentSelectorProps {
    components: SelectableComponent[];
}

interface ComponentSelectorState {
    selectedComponent?: SelectableComponent;
}

export class ComponentSelector extends React.Component<ComponentSelectorProps, ComponentSelectorState> implements Select.SelectAdapter<SelectableComponent>, Select.SelectListener<any> {

    constructor(props: ComponentSelectorProps) {
        super(props);
        this.state = { };
    }

    componentWillReceiveProps(nextProps: ComponentSelectorProps, context: any) {
        // Going to reset the state back to 0.
        this.state.selectedComponent = undefined;
        this.setState(this.state);
    }

    getCount(): number {
        return this.props.components.length;
    }

    getItem(index: number): SelectableComponent {
        return this.props.components[index];
    }

    getTitle(index: number): string {
        return this.props.components[index].title;
    }

    onSelected(item: SelectableComponent, index: number): void {
        console.info("SELECTED " + item.title);
        this.state.selectedComponent = item;
        this.setState(this.state);
    }

    onUnselected() {
        console.info("UNSELECTED");
        this.state.selectedComponent = undefined;
        this.setState(this.state);
    }

    render() {
        let component: JSX.Element = (this.state.selectedComponent) ? this.state.selectedComponent.component : (<div/>);

        return (
            <div>
                <Select.Select hint={"Choose"} adapter={this} selectListener={this} />
                {component}
            </div>
        );
    }
}