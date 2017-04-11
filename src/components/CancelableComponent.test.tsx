import * as Bluebird from "bluebird";
import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import { Cancelable, CancelableComponent } from "./CancelableComponent";

chai.use(sinonChai);
const expect = chai.expect;

describe("CancelableComponent", function () {
    let wrapper: ShallowWrapper<any, any>;

    beforeEach(function () {
        wrapper = shallow(<CancelableComponent />);
    });

    it("Tests the canceled components registered in the component are canceld on unmount.", function () {
        const cancel = new CancelableObj();
        const component = wrapper.instance() as CancelableComponent<any, any>;
        component.registerCancelable(cancel);
        component.registerCancelable(cancel);
        component.registerCancelable(cancel);
        component.registerCancelable(cancel);

        wrapper.unmount();

        expect(cancel.cancel).to.have.callCount(4);
    });

    it("Tests the canceled components registered in the component are canceled on props change if true.", function () {
        const cancel = new CancelableObj();
        const component = wrapper.instance() as CancelableComponent<any, any>;
        component.registerCancelable(cancel, true);
        component.registerCancelable(cancel, true);
        component.registerCancelable(cancel, true);
        component.registerCancelable(cancel, true);

        wrapper.setProps({ new: "data" });

        expect(cancel.cancel).to.have.callCount(4);
    });

    it("Tests the canceled components registered in the component are *not* called on unmount if canceled in props.", function () {
        const cancel = new CancelableObj();
        const component = wrapper.instance() as CancelableComponent<any, any>;
        component.registerCancelable(cancel, true);
        component.registerCancelable(cancel, true);
        component.registerCancelable(cancel, true);
        component.registerCancelable(cancel, true);

        wrapper.setProps({});

        wrapper.unmount();

        expect(cancel.cancel).to.have.callCount(4);
    });

    it("Tests the canceled components registered in the component are canceled in unmount if props was true but no props changed.", function () {
        const cancel = new CancelableObj();
        const component = wrapper.instance() as CancelableComponent<any, any>;
        component.registerCancelable(cancel, true);
        component.registerCancelable(cancel, true);
        component.registerCancelable(cancel, true);

        wrapper.unmount();

        expect(cancel.cancel).to.have.callCount(3);
    });

    it("Tests the resolve method returns a promise and registers as a cancelable.", function () {
        const component = wrapper.instance() as CancelableComponent<any, any>;

        const promise = component.resolve("Hello");
        expect(component.cancelables).to.have.length(1);
        return promise.then(function (obj: any) {
            expect(obj).to.equal("Hello");
        });
    });

    it("Tests the resolve method returns a promise which can be canceled under props change..", function () {
        const component = wrapper.instance() as CancelableComponent<any, any>;

        const promise = component.resolve("Hello", true);
        expect(component.cancelOnProps).to.have.length(1);
        return promise.then(function (obj: any) {
            expect(obj).to.equal("Hello");
        });
    });

    it("Tests that the cancelable is removed when the promise is finished with normal cancelables.", function () {
        const component = wrapper.instance() as CancelableComponent<any, any>;
        const promise = component.resolve("Hello");
        return promise.then(function (obj: any) {
            expect(component.cancelables).to.have.length(0);
        });
    });

    it("Tests that the cancelable is removed when the promise is finished with props cancelables.", function () {
        const component = wrapper.instance() as CancelableComponent<any, any>;

        const promise = component.resolve("Hello", true);
        return promise.then(function (obj: any) {
            expect(component.cancelOnProps).to.have.length(0);
        });
    });

    it("Tests that the cancelable is removed from the middle of the canceled stack when finished.", function () {
        const component = wrapper.instance() as CancelableComponent<any, any>;
        component.resolve(delayPromise(1000, "Hello"));
        component.resolve(delayPromise(1000, "Hello"));
        const promise2 = component.resolve("Hello");
        component.resolve(delayPromise(1000, "Hello"));

        return promise2.then(function () {
            for (let c of component.cancelables) {
                expect(c).to.not.equal(promise2);
            }
            for (let c of component.cancelOnProps) {
                expect(c).to.not.equal(promise2);
            }
            component.componentWillUnmount(); // Cancels the rest.
        });
    });

    it("Tests that the cancelable is removed from the middle of the cancelOnProps stack when finished.", function () {
        const component = wrapper.instance() as CancelableComponent<any, any>;
        component.resolve(delayPromise(1000, "Hello"), true);
        component.resolve(delayPromise(1000, "Hello"), true);
        const promise2 = component.resolve("Hello", true);
        component.resolve(delayPromise(1000, "Hello"), true);

        return promise2.then(function () {
            for (let c of component.cancelables) {
                expect(c).to.not.equal(promise2);
            }
            for (let c of component.cancelOnProps) {
                expect(c).to.not.equal(promise2);
            }
            component.componentWillUnmount(); // Cancels the rest.
        });
    });
});

class CancelableObj implements Cancelable {
    constructor() {
        this.cancel = sinon.stub();
    }

    reset() {
        this.cancel.reset();
    }

    cancel: sinon.SinonStub;
}

function delayPromise(ms: number, returnObj: any): Promise<any> {
    return Bluebird.delay(ms, returnObj);
}