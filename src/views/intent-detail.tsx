import {Intent} from "../models/intent"

export class IntentDetail extends React.Component<Intent, {}> {
    render() {
        return <h1>Hello from {this.props.name} and {this.props.description}!</h1>;
    }
}
