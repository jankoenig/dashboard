import * as React from "react";
import Switch from "react-toolbox/lib/switch";

import { FeatureToggleMap } from "../../models/UserSettings";

interface UserBetaFeaturesProps {

}

interface UserBetaFeaturesState {
    betaFeatures: FeatureToggleMap;
}

export default class UserBetaFeatures extends React.Component<UserBetaFeaturesProps, UserBetaFeaturesState> {

    constructor(props: UserBetaFeaturesProps) {
        super(props);

        this.state = {
            betaFeatures: {}
        };
    }

    handleChange(field: string, value: boolean) {
        console.log(field + " " + value);
        this.state.betaFeatures[field] = value;
        this.setState(this.state);
    }
    render() {
        return (
            <span>
                <h4>Beta Features</h4>
                <Switch
                    checked={this.state.betaFeatures["session"]}
                    label="Session Summaries"
                    onChange={this.handleChange.bind(this, "session")}
                     />
            </span>
        );
    }
}