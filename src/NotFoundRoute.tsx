import * as React from "react";
import { RouteComponentProps } from "react-router";

import NotFoundPage from "./pages/NotFoundPage";

interface NotFoundProps extends RouteComponentProps<any> {

}

export class NotFoundRoute extends React.Component<NotFoundProps, any>  {
    render() {
        return (
            <NotFoundPage />
        );
    }
}

export default NotFoundRoute;