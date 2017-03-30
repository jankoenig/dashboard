
export type FeatureToggleMap = { [feature: string]: boolean };

interface UserSettingsProps {
    betaFeatures?: FeatureToggleMap;
}

export default class UserSettings implements UserSettingsProps {
    readonly betaFeatures: FeatureToggleMap;

    constructor(props: UserSettingsProps) {
        this.betaFeatures = props.betaFeatures || {};
    }
}