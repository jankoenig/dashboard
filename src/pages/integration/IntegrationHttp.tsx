import * as React from "react";

import Input from "react-toolbox/lib/input";

interface HttpProps {
    url?: string;
    onUrlChange?: (newUrl: string) => void;
}

interface HttpState {

}

export class IntegrationHttp extends React.Component<HttpProps, HttpState> {
    static defaultProps: HttpProps = {
        url: ""
    };

    render() {
        const { url, onUrlChange } = this.props;
        return (<Input label={"URL"} value={url} onChange={onUrlChange} />);
    }
}

export default IntegrationHttp;