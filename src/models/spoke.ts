export type PIPE_TYPE = "HTTP" | "LAMBDA";

export interface Spoke {
    /**
     * Secret key of the skill.
     */
    readonly uuid: string;
    /**
     * A unique diagnostic key for the skill. Currently the same as the secret key.
     */
    readonly diagnosticKey: string;
    /**
     * The location that the skill would be retrieved from.
     */
    readonly endPoint: {
        /**
         * Skill ID.
         */
        readonly name: string;
    };
    readonly http?: {
        readonly url: string;
    };
    readonly lambda?: {
        readonly lambdaARN: string;
        readonly awsAccessKey: string;
        readonly awsSecretKey: string;
    };
    /**
     * Location to the pipe.
     */
    readonly path: string;
    /**
     * Type of pipe this is.
     */
    readonly pipeType: PIPE_TYPE;
    /**
     * True or false based on whether live debugging is enabled.
     */
    readonly proxy: boolean;
}

export default Spoke;