
import * as React from 'react';
import { Link } from 'react-router';

var LoginView = React.createClass({
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
