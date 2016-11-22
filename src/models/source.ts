import * as uuid from "uuid";

import StringUtil from "../utils/string";
import SourceProfile, { SourceProfileUnspecified } from "./source-profile";

export interface SourceProperties {
    secretKey?: string;
    name: string;
    members?: any;
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
    readonly created: Date;

    constructor(props: SourceProperties) {

        this.name = props.name;
        this.secretKey = props.secretKey ? props.secretKey : uuid.v4();
        this.id = props.id ? props.id : StringUtil.stringToSlug(this.name);
        this.profile = props.profile ? props.profile : SourceProfileUnspecified;
        this.members = props.members ? props.members : {};

        this.created = new Date();

        if (props.created) {
            if (props.created instanceof Date) {
                this.created = props.created;
            } else if (typeof props.created  === "string") {
                this.created = new Date(props.created);
            }
        }
    }
}

export default Source;