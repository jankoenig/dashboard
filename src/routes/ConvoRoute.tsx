import * as React from "react";
import { RouteComponentProps } from "react-router";

import ConvoPage from "../pages/logspage/ConvoPage";

interface ConvoRouteProps extends RouteComponentProps<void> {

}

export class ConvoRoute extends React.Component<ConvoRouteProps, any> {
    render() {
        return (<ConvoPage />);
    }
}

export default ConvoRoute;