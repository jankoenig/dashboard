import * as React from "react";
import { RouteComponentProps } from "react-router";

import IntegrationPage from "./pages/integration/StateIntegrationPage";

interface IntegrationProps extends RouteComponentProps<any> {

}

export class IntegrationRoute extends React.Component<IntegrationProps, any>  {
    render() {
        return (
            <IntegrationPage />
        );
    }
}

export default IntegrationRoute;