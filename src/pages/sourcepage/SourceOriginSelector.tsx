import * as React from "react";

import Checkbox from "react-toolbox/lib/checkbox";
import { Cell, Grid } from "../../components/Grid";

import Noop from "../../utils/Noop";

export interface SourceOption {
    label: string;
    theme: string;
    checked: boolean;
}

interface SourceOriginSelectorProps {
    options: SourceOption[];
    onChecked?: (index: number, label: string) => void;
}

interface SourceOriginSelectorState {

}

export class SourceOriginSelector extends React.Component<SourceOriginSelectorProps, SourceOriginSelectorState> {

    static defaultProps: SourceOriginSelectorProps = {
        options: [],
        onChecked: Noop
    };

    static createBoxes(props: SourceOriginSelectorProps): JSX.Element[] {
        const { options, onChecked } = props;
        let boxes: JSX.Element[] = [];
        let i = 0;
        for (let option of options) {
            boxes.push(
                <Cell key={i} col={2}>
                    <Checkbox
                        {...option}
                        onChange={onChecked.bind(onChecked, i, option.label)}
                    />
                </Cell>
            );
            ++i;
        }
        return boxes;
    }

    render() {
        return (
            <Grid>
                {SourceOriginSelector.createBoxes(this.props)}
            </Grid>
        );
    }
}

export default SourceOriginSelector;