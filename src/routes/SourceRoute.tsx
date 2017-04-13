import * as React from "react";
import { RouteComponentProps } from "react-router";

import SourcePage from "../pages/sourcepage/SourcePage";

interface SourceRouteProps extends RouteComponentProps<void> {

}

export class SourceRoute extends React.Component<SourceRouteProps, any> {
    render() {
        return (<SourcePage />);
    }
}

export default SourceRoute;