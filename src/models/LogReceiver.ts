import Log from "./log";

interface LogReceiver {
    postLog: (log: Log) => void;
}

export default LogReceiver;