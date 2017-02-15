const jsdom = require("mocha-jsdom");

import * as chai from "chai";
import { mount, ReactWrapper } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import VisibilityWatcher from "./VisibilityWatcher";

// Setup chai with sinon-chai
chai.use(sinonChai);
let expect = chai.expect;

describe("VisibilityWatcher", function () {

    describe("Full Render", function () {

        jsdom();

        let addEventListener: Sinon.SinonStub;
        let removeEventListener: Sinon.SinonStub;
        let onChangeListener: Sinon.SinonStub;
        let wrapper: ReactWrapper<any, any>;

        before(function () {
            console.log(document);
            addEventListener = sinon.stub(document, "addEventListener");
            removeEventListener = sinon.stub(document, "removeEventListener");
        });

        beforeEach(function () {
            addEventListener.reset();
            removeEventListener.reset();
            onChangeListener = sinon.stub();
            wrapper = mount(<VisibilityWatcher onChange={onChangeListener} />);
        });

        after(function () {
            addEventListener.restore();
            removeEventListener.restore();
        });

        it("Tests the visibility changed listener are registered.", function () {
            expect(addEventListener).to.be.calledOnce;
            expect(addEventListener).to.be.calledWith("visibilitychange");
        });

        // JSDom doesn't like being unmounted.
        xit("Tests the listeners are unregistered.", function () {
            wrapper.unmount();

            expect(removeEventListener).to.be.calledOnce;
            expect(removeEventListener).to.be.calledWith("visibilitychange");
        });
    });
});
