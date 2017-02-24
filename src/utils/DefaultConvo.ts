import Conversation, { createConvo } from "../models/conversation";
import Log from "../models/Log";

export const defaultRequest: Log = {
    payload: "N/A",
    stack: "N/A",
    log_type: "INFO",
    source: "N/A",
    transaction_id: "N/A",
    timestamp: new Date(0, 0, 0, 0, 0, 0, 0),
    tags: ["request"],
    id: "N/A"
};

export const defaultResponse: Log = {
    payload: "N/A",
    stack: "N/A",
    log_type: "INFO",
    source: "N/A",
    transaction_id: "N/A",
    timestamp: new Date(0, 0, 0, 0, 0, 0, 0),
    tags: ["response"],
    id: "N/A"
};

export const defaultConvo: Conversation = createConvo({
    request: defaultRequest,
    response: defaultResponse,
    outputs: [],
    stackTraces: []
});

export default defaultConvo;