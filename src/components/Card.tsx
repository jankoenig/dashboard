import * as React from "react";

export default class Card extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return <div className="mdl-card">
                  { this.props.children }
              </div>;
    }
}
