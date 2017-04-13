import * as Bluebird from "bluebird";
import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import LoadingComponent, { LoadingState } from "./LoadingComponent";

chai.use(sinonChai);
const expect = chai.expect;

describe("LoadingComponent", function () {

    describe("No stubs", function () {
        let setStateSpy: sinon.SinonSpy;
        let cancelSpy: sinon.SinonSpy;
        let startLoadingSpy: sinon.SinonSpy;
        let mapSpy: sinon.SinonSpy;
        let errorSpy: sinon.SinonSpy;
        let preloadSpy: sinon.SinonSpy;

        before(function () {
            setStateSpy = sinon.spy(LoadingComponent.prototype, "setState");
            cancelSpy = sinon.spy(LoadingComponent.prototype, "cancel");
            startLoadingSpy = sinon.spy(LoadingComponent.prototype, "startLoading");
            mapSpy = sinon.spy(LoadingComponent.prototype, "map");
            errorSpy = sinon.spy(LoadingComponent.prototype, "onLoadError");
            preloadSpy = sinon.spy(LoadingComponent.prototype, "preLoad");
        });

        afterEach(function () {
            setStateSpy.reset();
            cancelSpy.reset();
            startLoadingSpy.reset();
            mapSpy.reset();
            errorSpy.reset();
            preloadSpy.reset();
        });

        after(function () {
            setStateSpy.restore();
            cancelSpy.restore();
            startLoadingSpy.restore();
            mapSpy.restore();
            errorSpy.restore();
            preloadSpy.restore();
        });

        describe("Initial Load", function () {
            let wrapper: ShallowWrapper<any, any>;
            let currentLoadingPromise: Bluebird<any>;

            beforeEach(function () {
                wrapper = shallow(<LoadingComponent />);
                currentLoadingPromise = (wrapper.instance() as LoadingComponent<any, any, any>).loadingPromise;
            });

            it("Tests that the currentLoadingPromise exists. If not, then the rest of the tests will fail.", function () {
                expect(currentLoadingPromise).to.exist;
            });

            it("Tests that cancel is called on mount.", function () {
                return currentLoadingPromise.then(function () {
                    expect(cancelSpy).to.be.calledOnce;
                });
            });

            it("Tests that the component loads all states.", function () {
                return currentLoadingPromise.then(function () {
                    // It'll finish almost imediately.
                    expect(setStateSpy).to.be.calledTwice;
                    expect(setStateSpy.getCall(0).args[0]).to.have.property("state", LoadingState.LOADING);
                    expect(setStateSpy.getCall(1).args[0]).to.have.property("state", LoadingState.LOADED);
                });
            });

            it("Tests that it starts loading on mount.", function () {
                return currentLoadingPromise.then(function () {
                    expect(startLoadingSpy).to.have.been.calledOnce;
                    expect(startLoadingSpy).to.have.been.calledWith(wrapper.props());
                });
            });

            it("Tests that the loading process going through the mapping function.", function () {
                return currentLoadingPromise.then(function () {
                    expect(mapSpy).to.have.been.calledOnce;
                });
            });

            it("Cancels on unmount", function () {
                wrapper.unmount();
                expect(cancelSpy).to.have.been.calledTwice;
            });

            it("Tests that the preload callback was called.", function() {
                return currentLoadingPromise.then(function() {
                    expect(preloadSpy).to.be.calledOnce;
                    expect(preloadSpy).to.be.calledWith(wrapper.props());
                });
            });

            describe("Props management", function () {
                it("Tests that an update is called with props update.", function () {
                    wrapper.setProps({ data: "New data " });
                    currentLoadingPromise = (wrapper.instance() as LoadingComponent<any, any, any>).loadingPromise;
                    return currentLoadingPromise.then(function () {
                        expect(startLoadingSpy).to.have.been.calledTwice; // Mount then props change.
                    });
                });

                it("Tests that a cancel was called with props update.", function () {
                    wrapper.setProps({ data: "new Data" });
                    currentLoadingPromise = (wrapper.instance() as LoadingComponent<any, any, any>).loadingPromise;
                    return currentLoadingPromise.then(function () {
                        expect(cancelSpy).to.have.been.calledTwice; // Mount then props change.
                    });
                });

                it("Tests that a load will not occur if the props are not the same.", function () {
                    (wrapper.instance() as LoadingComponent<any, any, any>).shouldUpdate = sinon.stub().returns(false);
                    wrapper.setProps({ data: "Data" });
                    currentLoadingPromise = (wrapper.instance() as LoadingComponent<any, any, any>).loadingPromise;
                    return currentLoadingPromise.then(function () {
                        expect(startLoadingSpy).to.have.been.calledOnce;
                    });
                });
            });

            describe("Load Error", function () {
                let startLoadingStub: sinon.SinonStub;

                before(function () {
                    startLoadingSpy.restore();
                    startLoadingStub = sinon.stub(LoadingComponent.prototype, "startLoading", function () {
                        return Promise.reject(new Error("Error per requirements of the test."));
                    });
                });

                afterEach(function () {
                    startLoadingStub.reset();
                });

                after(function () {
                    startLoadingStub.restore();
                    startLoadingSpy = sinon.spy(LoadingComponent.prototype, "startLoading");
                });

                it("Tests that an error state is in place on load error.", function () {
                    return currentLoadingPromise.catch(function () {
                        // It'll finish almost imediately.
                        expect(setStateSpy).to.be.calledTwice;
                        expect(setStateSpy.getCall(0).args[0]).to.have.property("state", LoadingState.LOADING);
                        expect(setStateSpy.getCall(1).args[0]).to.have.property("state", LoadingState.LOAD_ERROR);
                    });
                });

                it("Tests that the onError method was called.", function () {
                    return currentLoadingPromise.catch(function () {
                        expect(errorSpy).to.be.calledOnce;
                    });
                });
            });
        });
    });

    xdescribe("Stubbed", function () {

        let setStateSpy: sinon.SinonSpy;
        let cancelSpy: sinon.SinonSpy;
        let startLoadingStub: sinon.SinonStub;
        let mapStub: sinon.SinonStub;

        let loadedData: any;
        let mappedData: any;
        let runLoad: boolean;
        let runMap: boolean;

        before(function () {
            runLoad = true;
            runLoad = true;
            loadedData = { data: "Data" };
            mappedData = { mapData: "New data" };
            setStateSpy = sinon.spy(LoadingComponent.prototype, "setState");
            cancelSpy = sinon.spy(LoadingComponent.prototype, "cancel");
            startLoadingStub = sinon.stub(LoadingComponent.prototype, "startLoading", function () {
                return new Promise((resolve, reject) => {
                    while (runLoad);
                    resolve(loadedData);
                });
            });
            mapStub = sinon.stub(LoadingComponent.prototype, "map", function () {
                return new Promise((resolve, reject) => {
                    while (runMap);
                    resolve(mappedData);
                });
            });
        });

        afterEach(function () {
            setStateSpy.reset();
            cancelSpy.reset();
            startLoadingStub.reset();
            mapStub.reset();
            runLoad = true;
            runMap = true;
        });

        after(function () {
            setStateSpy.restore();
            cancelSpy.restore();
            startLoadingStub.restore();
            mapStub.restore();
        });

        function stopLoad() {
            runLoad = false;
        }

        // function stopMap() {
        //     runMap = false;
        // }

        describe("Prolonged load", function () {
            let wrapper: ShallowWrapper<any, any>;
            let instance: LoadingComponent<any, any, any>;
            let currentLoadingPromise: Bluebird<any>;

            beforeEach(function () {
                wrapper = shallow(<LoadingComponent />);
                instance = wrapper.instance() as LoadingComponent<any, any, any>;
                currentLoadingPromise = instance.loadingPromise;
            });

            it("Tests cancel will stop the operation.", function () {
                // if it gets stuck in the stub, then it'll cancel out and skip the map because data was never returned.
                stopLoad();
                instance.cancel();
                return currentLoadingPromise
                    .finally(function () {
                        expect(mapStub).to.not.have.been.called;
                    });
            });
        });
    });
});