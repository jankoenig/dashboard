import * as React from "react";
import { RouteComponentProps } from "react-router";

import SourceListPage from "./pages/SourceListPage";

interface SourceListRouteProps extends RouteComponentProps<void> {

}

export class SourceListRoute extends React.Component<SourceListRouteProps, any> {
    render() {
        return (<SourceListPage />);
    }
}

export default SourceListRoute;