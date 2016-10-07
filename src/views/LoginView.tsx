
import * as React from "react";

let LoginView = React.createClass({
    getInitialState: function() {
        return { loaded: false };
    },

    componentDidMount: function() {
        this.setState({ loaded: true });
    },

    render: function() {
        return <div>
                  <h2>You need to login</h2>
              </div>;
    }
});

export default LoginView;
