import * as uuid from "uuid";

import SourceProfile from "./source-profile";

export interface SourceProperties {
    id?: string;
    name: string;
    profile?: SourceProfile;
}

export default class Source implements SourceProperties {

    readonly id: string;
    readonly name: string;
    readonly profile?: SourceProfile;

    constructor(props: SourceProperties) {
        this.id = props.id ? props.id : uuid.v4();
        this.name = props.name;
        this.profile = props.profile;
    }
}