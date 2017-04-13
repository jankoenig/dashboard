import * as Bluebird from "bluebird";
import * as React from "react";

Bluebird.config({
    cancellation: true
});

export interface Cancelable {
    cancel: () => void;
}

export interface PromiseComponentProps {

}

export interface PromiseComponentState {

}

/**
 * A component that will automatically cancel Promises that were issued. All cancelables must be created through the methods of
 * this class or sent to `registerCancelable`
 */
export class CancelableComponent<P extends PromiseComponentProps, S extends PromiseComponentState> extends React.Component<P, S> {

    cancelables: Cancelable[];
    cancelOnProps: Cancelable[];

    constructor(props: P) {
        super(props);

        this.cancelables = [];
        this.cancelOnProps = [];

        this.resolve = this.resolve.bind(this);
        this.registerCancelable = this.registerCancelable.bind(this);
    }

    /**
     * Child classes must call super.
     */
    componentWillReceiveProps(nextProps: P, context: any) {
        for (let c of this.cancelOnProps) {
            c.cancel();
        }
        this.cancelOnProps = [];
    }

    /**
     * Child classes much call super.
     */
    componentWillUnmount() {
        console.log("Canceling " + this.cancelables.length + " " + this.cancelOnProps.length);
        for (let c of this.cancelables) {
            c.cancel();
        }
        for (let c of this.cancelOnProps) {
            c.cancel();
        }
        this.cancelables = [];
        this.cancelOnProps = [];
    }

    resolve<T>(obj: T | Thenable<T>, cancelOnPropsChange?: boolean): Promise<T> {
        const newPromise = Bluebird.resolve(obj);
        this.registerCancelable(newPromise, cancelOnPropsChange);
        return newPromise.finally(() => {
            this.unregisterCancelable(newPromise, cancelOnPropsChange);
        });
    }

    /**
     * Registers a Cancelable object to automatically be canceled on unmount.
     * @param c The cancelable to register.
     * @param cancelOnPropsChange True if the cancelable should be canceled on `onComponentWillChangeProps` as well. It will still
     * be canceled on unmount as well if the component's props were not updated.
     */
    registerCancelable(c: Cancelable, cancelOnPropsChange: boolean = false) {
        if (cancelOnPropsChange) {
            this.cancelOnProps.push(c);
        } else {
            this.cancelables.push(c);
        }
    }

    unregisterCancelable(c: Cancelable, cancelOnPropsChange: boolean = false) {
        const arr = (cancelOnPropsChange) ? this.cancelOnProps : this.cancelables;
        let index = 0;
        for (let obj of arr) {
            if (c === obj) {
                break;
            }
            ++index;
        }
        arr.splice(index, 1);
    }

    render() {
        return (<div />);
    }
}

export default CancelableComponent;