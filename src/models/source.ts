import * as uuid from "uuid";

import util from "../utils";
import SourceProfile, { SourceProfileUnspecified } from "./source-profile";

export interface SourceProperties {
    secretKey?: string;
    name: string;
    members?: any;
    profile?: SourceProfile;
    id?: string;
}

export class Source implements SourceProperties {

    readonly secretKey: string;
    readonly name: string;
    readonly members: any;
    readonly id: string;
    readonly profile?: SourceProfile;

    constructor(props: SourceProperties) {
        this.name = props.name;
        this.secretKey = props.secretKey ? props.secretKey : uuid.v4();
        this.id = props.id ? props.id : util.stringToSlug(this.name);
        this.profile = props.profile ? props.profile : SourceProfileUnspecified;
        this.members = props.members ? props.members : {};
    }
}

export default Source;