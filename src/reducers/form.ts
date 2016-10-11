export type FormState = {
    email?: string;
    password?: string;
}

const INITIAL_STATE: FormState = {
    email: "initial email",
    password: "initial password"
};

export function form() {
    return INITIAL_STATE;
} 