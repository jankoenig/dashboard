import * as React from "react";

import Input from "react-toolbox/lib/input";

interface HttpProps {
    readonly theme?: string;
    readonly url?: string;
    readonly onUrlChange?: (newUrl: string) => void;
}

interface HttpState {

}

export class IntegrationHttp extends React.Component<HttpProps, HttpState> {
    static defaultProps: HttpProps = {
        url: ""
    };

    render() {
        const { url, onUrlChange, ...others } = this.props;
        return (<Input {...others} label={"URL"} value={url} onChange={onUrlChange} />);
    }
}

export default IntegrationHttp;