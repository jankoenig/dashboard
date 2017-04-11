export interface Members {
    readonly [userId: string]: string;
}

export interface SourceProperties {
    readonly name: string;
    readonly secretKey?: string;
    readonly members?: Members;
    readonly id?: string;
    readonly created?: Date | string;
}

export class Source implements SourceProperties {

    readonly secretKey: string | undefined;
    readonly name: string;
    readonly members: Members;
    readonly id: string | undefined;
    readonly created: string | undefined; // Firebase requires a "string" so this must be kept as a string.

    constructor(props: SourceProperties) {

        this.name = props.name;
        this.id = props.id;
        this.members = props.members ? { ...props.members } : {};
        this.secretKey = props.secretKey;
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