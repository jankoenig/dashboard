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
        return promise.then(function (obj: any) {
            expect(obj).to.equal("Hello");
            expect(component.cancelables[0]).to.equal(promise);
        });
    });

    it("Tests the resolve method returns a promise which can be canceled under props change..", function () {
        const component = wrapper.instance() as CancelableComponent<any, any>;

        const promise = component.resolve("Hello", true);
        return promise.then(function (obj: any) {
            expect(obj).to.equal("Hello");
            expect(component.cancelOnProps[0]).to.equal(promise);
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

    cancel: Sinon.SinonStub;
}