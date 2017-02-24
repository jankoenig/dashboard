namespace Interval {
    export interface Executor {
        start: () => void;
        end: () => void;
    }

    export function newExecutor(ms: number, callback: () => void): Executor {
        return new HiddenExecutor(ms, callback);
    }
}

export default Interval;

class HiddenExecutor implements Interval.Executor {

    readonly ms: number;
    readonly callback: () => void;

    timestamp: any;

    constructor(ms: number, callback: () => void) {
        this.ms = ms;
        this.callback = callback;
    }

    start() {
        if (!this.timestamp) {
            this.timestamp = setInterval(this.callback, this.ms);
        }
    }

    end() {
        if (this.timestamp) {
            clearInterval(this.timestamp);
            this.timestamp = undefined;
        }
    }
}