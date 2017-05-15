export interface Members {
    [userId: string]: string;
}

export interface SourceProperties {
    name: string;
    secretKey?: string;
    members?: Members;
    id?: string;
    created?: Date | string;
    url?: string;
}

export class Source implements SourceProperties {

    readonly secretKey: string | undefined;
    readonly name: string;
    readonly members: Members;
    readonly id: string | undefined;
    readonly created: string | undefined; // Firebase requires a "string" so this must be kept as a string.
    public url: string | undefined;

    constructor(props: SourceProperties) {

        this.name = props.name;
        this.id = props.id;
        this.members = props.members ? { ...props.members } : {};
        this.secretKey = props.secretKey;
        this.url = props.url;
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
