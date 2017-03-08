import * as chai from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import Query from "../../models/query";
import { DataLoader, DataState, GenericStateHandler, LoadCallback, Loader, StateHandler } from "./DataLoader";

chai.use(sinonChai);
const expect = chai.expect;

describe("DataLoader", function () {
    describe("GenericStateHandler", function () {

        let state: any;
        let handler: GenericStateHandler<any>;
        let setState: Sinon.SinonStub;

        before(function () {
            setState = sinon.stub();
        });

        beforeEach(function () {
            state = {};
            handler = new GenericStateHandler(state, "testState", "testData", setState);
        });

        afterEach(function () {
            setState.reset();
        });

        it("Tests the isLoaded callback", function () {
            const data = { testData: "Test" };
            handler.onLoaded(data);

            expect(state).to.have.property("testData", data);
            expect(setState).to.have.been.calledWith(state);
        });

        it("Tests the setState callback", function () {
            handler.stateChange(DataState.ERROR);

            expect(state).to.have.property("testState", DataState.ERROR);
            expect(setState).to.have.been.calledWith(state);
        });
    });

    describe("Loader", function () {
        let query: Query;
        let dataLoader: StubLoader;
        let stateHandler: StubStateHandler;
        let loadCallback: StubLoaderCallback;
        let loader: Loader<any, any>;

        before(function () {
            query = new Query();
            dataLoader = new StubLoader();
            stateHandler = new StubStateHandler();
            loadCallback = new StubLoaderCallback();
            loader = new Loader(dataLoader, stateHandler, loadCallback);
        });

        afterEach(function () {
            dataLoader.reset();
            stateHandler.reset();
            loadCallback.reset();
        });

        it("Tests the dataLoader callbacks", function () {
            return loader.load(query).then(function (data: any) {
                expect(dataLoader.loadData).to.have.been.calledWith(query);
                expect(dataLoader.map).to.have.been.calledWith(dataLoader.serverData);
            });
        });

        it("Tests the result", function () {
            return loader.load(query).then(function (data: any) {
                expect(data).to.equal(dataLoader.clientData);
            });
        });

        it("Tests the stateHandler", function () {
            return loader.load(query).then(function (data: any) {
                expect(stateHandler.stateChange.firstCall).to.be.calledWith(DataState.LOADING);
                expect(stateHandler.stateChange.secondCall).to.be.calledWith(DataState.LOADED);
            });
        });

        it("Tests the loadCallback", function () {
            return loader.load(query).then(function (data: any) {
                expect(loadCallback.onLoaded).to.be.calledWith(data);
            });
        });

        describe("Tests error conditions.", function () {
            before(function () {
                let query: Query;
                let dataLoader: StubLoader;
                let stateHandler: StubStateHandler;
                let loadCallback: StubLoaderCallback;
                let loader: Loader<any, any>;

                before(function () {
                    query = new Query();
                    dataLoader = new ErrorStubLoader();
                    stateHandler = new StubStateHandler();
                    loadCallback = new StubLoaderCallback();
                    loader = new Loader(dataLoader, stateHandler, loadCallback);
                });

                afterEach(function () {
                    dataLoader.reset();
                    stateHandler.reset();
                    loadCallback.reset();
                });

                it("Tests that the error was called in the stateHandler", function () {
                    return loader.load(query).then(function () {
                        expect(true, "An error should have been thrown but was not.").to.be.false;
                    }).catch(function (err: any) {
                        expect(stateHandler.stateChange.secondCall).to.have.been.calledWith(DataState.ERROR);
                    });
                });

                it("Tests that the error was called in the loadCallback", function () {
                    return loader.load(query).then(function () {
                        expect(true, "An error should have been thrown but was not.").to.be.false;
                    }).catch(function (err: any) {
                        expect(loadCallback.onError).to.have.been.calledWith(err);
                    });
                });
            });
        });
    });
});

class StubLoader implements DataLoader<any, any> {
    serverData: any;
    clientData: any;
    loadData: Sinon.SinonStub;
    map: Sinon.SinonStub;

    constructor() {
        this.serverData = { serverData: "serverValue" };
        this.clientData = { clientData: "clientValue" };
        this.loadData = sinon.stub().returns(Promise.resolve(this.serverData));
        this.map = sinon.stub().returns(this.clientData);
    }

    reset() {
        this.loadData.reset();
        this.map.reset();
    }
}

class ErrorStubLoader extends StubLoader {
    constructor() {
        super();
        this.loadData = sinon.stub().returns(Promise.reject(new Error("Error per requirements of the test.")));
    }
}

class StubStateHandler implements StateHandler {
    stateChange: Sinon.SinonStub;

    constructor() {
        this.stateChange = sinon.stub();
    }

    reset() {
        this.stateChange.reset();
    }
}

class StubLoaderCallback implements LoadCallback<any> {
    onLoaded: Sinon.SinonStub;
    onError: Sinon.SinonStub;

    constructor() {
        this.onLoaded = sinon.stub();
        this.onError = sinon.stub();
    }

    reset() {
        this.onLoaded.reset();
        this.onError.reset();
    }
}