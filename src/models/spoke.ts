export type PIPE_TYPE = "HTTP" | "LAMBDA";

export interface Spoke {
    /**
     * Secret key of the skill.
     */
    uuid: string;
    /**
     * A unique diagnostic key for the skill. Currently the same as the secret key.
     */
    diagnosticsKey: string;
    /**
     * The location that the skill would be retrieved from.
     */
    endPoint: {
        /**
         * Skill ID.
         */
        name: string;
    };
    http?: {
        url: string;
    };
    lambda?: {
        lambdaARN: string;
        awsAccessKey: string;
        awsSecretKey: string;
    };
    /**
     * Location to the pipe.
     */
    path: string;
    /**
     * Type of pipe this is.
     */
    pipeType: PIPE_TYPE;
    /**
     * True or false based on whether live debugging is enabled.
     */
    proxy: boolean;
}

export default Spoke;
