import * as React from "react";
import * as classNames from "classnames";

export default class Content extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    classes() {
      return classNames("mdl-layout__content mdl-color--grey-100");
    }

    render() {
        return <main className={ this.classes() }>
                  { this.props.children }
               </main>;
    }
}
