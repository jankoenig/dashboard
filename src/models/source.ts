import * as uuid from "uuid";

import StringUtil from "../utils/string";
import SourceProfile, { SourceProfileUnspecified } from "./source-profile";

export interface Members {
    [userId: string]: string;
}

export interface SourceProperties {
    secretKey?: string;
    name: string;
    members?: Members;
    profile?: SourceProfile;
    id?: string;
    created?: Date | string;
}

export class Source implements SourceProperties {

    readonly secretKey: string;
    readonly name: string;
    readonly members: any;
    readonly id: string;
    readonly profile?: SourceProfile;
    readonly created: string; // Needed because Firebase does not allow Date.

    constructor(props: SourceProperties) {

        this.name = props.name;
        this.secretKey = props.secretKey ? props.secretKey : uuid.v4();
        this.id = props.id ? props.id : StringUtil.stringToSlug(this.name);
        this.profile = props.profile ? props.profile : SourceProfileUnspecified;
        this.members = props.members ? props.members : [];

        this.created = new Date().toISOString();

        if (props.created) {
            if (props.created instanceof Date) {
                this.created = props.created.toISOString();
            } else if (typeof props.created  === "string") {
                this.created = new Date(props.created).toISOString();
            }
        }
    }
}

export default Source;