import * as React from "react";

import FormInput, { FormInputTheme } from "./FormInput";

interface DateTileProps {
    readonly  label: string;
    readonly value: string;
    readonly theme?: FormInputTheme;
    readonly hidden?: boolean;
    readonly showable?: boolean;
}

export class DataTile extends React.Component<DateTileProps, any> {
    render() {
        return (
            <FormInput
                theme={this.props.theme}
                type={this.props.hidden ? "password" : "text"}
                // Since these inputs will not have errors, it would be nice
                // to free up the 20px bottom padding reserved for the error
                // however it causes problems when the field is clicked.
                // We either need to figure out how to style ::after pseudo-elements
                // in React or create a new DataTile component not dependent on
                // the FormInput.  The latter is probably a better solution.
                // style={{ paddingBottom: 0 }}
                value={this.props.value}
                label={this.props.label}
                floatingLabel={true}
                autoComplete={"off"}
                showable={this.props.showable}
                autoFocus={false}
                readOnly={true} />
        );
    }
}

export default DataTile;