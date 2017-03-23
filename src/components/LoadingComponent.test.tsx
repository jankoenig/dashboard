import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import LoadingComponent, { LoadingState } from "./LoadingComponent";

chai.use(sinonChai);
const expect = chai.expect;

describe("LoadingComponent", function () {

    let setStateSpy: Sinon.SinonSpy;
    let cancelSpy: Sinon.SinonSpy;
    let startLoadingSpy: Sinon.SinonSpy;
    let mapSpy: Sinon.SinonSpy;

    before(function () {
        setStateSpy = sinon.spy(LoadingComponent.prototype, "setState");
        cancelSpy = sinon.spy(LoadingComponent.prototype, "cancel");
        startLoadingSpy = sinon.spy(LoadingComponent.prototype, "startLoading");
        mapSpy = sinon.spy(LoadingComponent.prototype, "map");
    });

    afterEach(function() {
        setStateSpy.reset();
        cancelSpy.reset();
        startLoadingSpy.reset();
        mapSpy.reset();
    });

    after(function() {
        setStateSpy.restore();
        cancelSpy.restore();
        startLoadingSpy.restore();
        mapSpy.restore();
    });

    describe("Initial Load", function () {
        let wrapper: ShallowWrapper<any, any>;
        let currentLoadingPromise: Thenable<any>;

        beforeEach(function() {
            wrapper = shallow(<LoadingComponent />);
            currentLoadingPromise = (wrapper.instance() as LoadingComponent<any, any, any>).loadingPromise;
        });

        it("Tests that the currentLoadingPromise exists. If not, then the rest of the tests will fail.", function() {
            expect(currentLoadingPromise).to.exist;
        });

        it("Tests that cancel is called on mount.", function() {
            return currentLoadingPromise.then(function() {
                expect(cancelSpy).to.be.calledOnce;
            });
        });

        it("Tests that the component loads all states.", function() {
            return currentLoadingPromise.then(function() {
                // It'll finish almost imediately.
                expect(setStateSpy).to.be.calledTwice;
                expect(setStateSpy.getCall(0).args[0]).to.have.property("state", LoadingState.LOADING);
                expect(setStateSpy.getCall(1).args[0]).to.have.property("state", LoadingState.LOADED);
            });
        });

        it("Tests that it starts loading on mount.", function() {
            return currentLoadingPromise.then(function() {
                expect(startLoadingSpy).to.have.been.calledOnce;
                expect(startLoadingSpy).to.have.been.calledWith(wrapper.props());
            });
        });

        it("Tests that the loading process going through the mapping function.", function() {
            return currentLoadingPromise.then(function() {
                expect(mapSpy).to.have.been.calledOnce;
            });
        });
    });
});