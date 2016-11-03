import * as uuid from "uuid";

import util from "../utils";
import SourceProfile, { SourceProfileUnspecified } from "./source-profile";

export interface SourceProperties {
    secretKey?: string;
    name: string;
    profile?: SourceProfile;
}

export default class Source implements SourceProperties {

    readonly secretKey: string;
    readonly name: string;
    readonly slug: string;
    readonly profile?: SourceProfile;

    constructor(props: SourceProperties) {
        this.secretKey = props.secretKey ? props.secretKey : uuid.v4();
        this.name = props.name;
        this.slug = util.stringToSlug(this.name);
        this.profile = props.profile ? props.profile : SourceProfileUnspecified;
    }
}