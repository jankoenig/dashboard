import * as objectAssign from "object-assign";
import * as uuid from "uuid";

import util from "../utils";
import SourceProfile, { SourceProfileUnspecified } from "./source-profile";

export interface SourceProperties {
    secretKey?: string;
    name: string;
    members?: any;
    profile?: SourceProfile;
    slug?: string;
}

export class Source implements SourceProperties {

    readonly secretKey: string;
    readonly name: string;
    readonly slug: string;
    readonly members: any;
    readonly profile?: SourceProfile;

    constructor(props: SourceProperties) {
        this.secretKey = props.secretKey ? props.secretKey : uuid.v4();
        this.name = props.name;
        this.slug = props.slug ? props.slug : util.stringToSlug(this.name);
        this.profile = props.profile ? props.profile : SourceProfileUnspecified;
        this.members = props.members ? props.members : {};
    }

    copyFromSource(): SourceProperties {
        return {
            secretKey: this.secretKey,
            name: this.name,
            members: objectAssign({}, this.members),
            profile: this.profile
        };
    }
}

export default Source;