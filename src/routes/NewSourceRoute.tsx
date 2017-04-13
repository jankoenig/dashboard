import * as React from "react";
import { RouteComponentProps } from "react-router";

import NewSourcePage from "../pages/NewSourcePage";

interface NewSourceRouteProps extends RouteComponentProps<void> {

}

export class NewSourceRoute extends React.Component<NewSourceRouteProps, any> {
    render() {
        return (<NewSourcePage />);
    }
}

export default NewSourceRoute;