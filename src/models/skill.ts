
export interface SkillProperties {
    readonly id: string;
    readonly displayName: string;
}

export default class Skill {

    readonly id: string;
    readonly displayName: string;

    constructor(props: SkillProperties) {
        this.id = props.id;
        this.displayName = props.displayName;
    }
}