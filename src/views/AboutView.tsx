
import * as React from "react";

export default class AboutView extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = { loaded: false };
    }

    componentDidMount() {
        this.setState({ loaded: true });
    }

    render() {
        let loading = this.state.loaded ? "" : " (loading...)";
        return  <div>
                  <h2>About</h2>
                  <p>{ loading }</p>
                </div>;
    }
}
