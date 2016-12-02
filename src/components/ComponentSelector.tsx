import * as React from "react";

import * as Select from "./Select";

export interface SelectableComponent {
    title: string;
    component: JSX.Element;
};

export interface ComponentSelectorProps {
    components: SelectableComponent[];
    onSelected: (index: number, component: SelectableComponent) => void;
    onUnselected: () => void;
}

interface ComponentSelectorState {
    selectedComponent?: SelectableComponent;
}

export class ComponentSelector extends React.Component<ComponentSelectorProps, ComponentSelectorState> implements Select.SelectAdapter<SelectableComponent> {

    constructor(props: ComponentSelectorProps) {
        super(props);
        this.state = { };
    }

    componentWillReceiveProps(nextProps: ComponentSelectorProps, context: any) {
        // Going to reset the state back to 0.
        // this.state.selectedComponent = undefined;
        // this.setState(this.state);
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
        this.state.selectedComponent = item;
        this.setState(this.state);
        this.props.onSelected(index, this.state.selectedComponent);
    }

    onUnselected() {
        this.state.selectedComponent = undefined;
        this.setState(this.state);
        this.props.onUnselected();
    }

    render() {
        let component: JSX.Element = (this.state.selectedComponent) ? this.state.selectedComponent.component : (<div/>);
        return (
            <div>
                <Select.Select hint={"Choose"} adapter={this} onSelected={this.onSelected.bind(this)} onUnselected={this.onUnselected.bind(this)} />
                {component}
            </div>
        );
    }
}