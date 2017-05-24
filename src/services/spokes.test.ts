import * as chai from "chai";
import * as fetchMock from "fetch-mock";
// import * as sinon from "sinon";
// import * as sinonChai from "sinon-chai";

import Source from "../models/source";
import Spoke from "../models/spoke";
import User from "../models/user";
import { dummySources } from "../utils/test";
import SpokesService from "./spokes";

const expect = chai.expect;

const BASE_URL = "https://api.bespoken.link";

const user: User = new User({ userId: "ABCD1234", photoUrl: "https://www.photoasdfasdvawef.commmm/", email: "test@test.test", displayName: "Testy MyTestface" });
const source: Source = dummySources(1)[0];

const fetchResponse = {
    uuid: source.secretKey,
    diagnosticsKey: source.secretKey,
    endPoint: {
        name: source.id
    },
    http: {
        url: "https://source.url/"
    },
    lambda: {
        lambdaARN: "Lambda ARN",
        awsAccessKey: "AWS Access Key",
        awsSecretKey: "AWS Secret Key"
    },
    path: "http://spoke.url/" + source.secretKey,
    pipeType: "HTTP", // In reality, the "lambda" wouldn't exist in a HTTP type, but it won't affect any tests here.
    proxy: true
};

const mockFetchResponse = Promise.resolve(fetchResponse);
const mockSaveResponse = Promise.resolve(200);
const mockFetchNotFoundResponse = Promise.resolve(404);
const mockSaveNotCreatedResponse = Promise.resolve(400);
const mockFetchError = Promise.reject(new Error("Failure per requirements of the test."));
const mockSaveError = Promise.reject(new Error("Failure per requirements of the test."));

describe("Spokes Service", function () {
    describe("Success Responses", function () {
        describe("Fetch Pipe", function () {
            before(function () {
                fetchMock.get(/https:\/\/api.bespoken.link\/pipe\/.*/, mockFetchResponse);
            });

            afterEach(function () {
                fetchMock.reset();
            });

            after(function () {
                fetchMock.restore();
            });

            it("Tests the appropriately URL was created.", function () {
                return SpokesService.fetchPipe(user, source)
                    .then(function () {
                        const url = BASE_URL + "/pipe/" + source.secretKey;
                        expect(fetchMock.lastUrl()).to.equal(url);
                    });
            });

            it("Tests that an error is thrown when an invalid user is not provided.", function () {
                const copyUser = { ...user, ...{ userId: undefined } };
                let caughtError: Error;
                return SpokesService.fetchPipe(copyUser, source)
                    .catch(function (err: Error) {
                        caughtError = err;
                    }).then(function () {
                        expect(caughtError).to.exist;
                    });
            });

            it("Tests the proper header is sent", function () {
                return SpokesService.fetchPipe(user, source)
                    .then(function (payload: Spoke) {
                        const args = fetchMock.lastCall()[1] as RequestInit;
                        const header = args.headers as any;
                        expect(header["x-access-userid"]).to.equal(user.userId);
                    });
            });

            it("Tests the spoke returned by the service is correct.", function () {
                return SpokesService.fetchPipe(user, source)
                    .then(function (payload: Spoke) {
                        expect(payload).to.exist;
                        expect(payload.diagnosticsKey).to.equal(fetchResponse.diagnosticsKey);
                        expect(payload.uuid).to.equal(fetchResponse.uuid);
                        expect(payload.endPoint).to.deep.equal(fetchResponse.endPoint);
                        expect(payload.pipeType).to.equal(fetchResponse.pipeType);
                        expect(payload.path).to.equal(fetchResponse.path);
                        expect(payload.proxy).to.equal(fetchResponse.proxy);
                        expect(payload.http).to.deep.equal(fetchResponse.http);
                        expect((payload as Spoke).lambda.awsSecretKey).to.not.exist;
                    });
            });
        });

        describe("Save Pipe", function () {
            before(function () {
                fetchMock.post(/https:\/\/api.bespoken.link\/pipe/, mockSaveResponse);
            });

            afterEach(function () {
                fetchMock.reset();
            });

            after(function () {
                fetchMock.restore();
            });

            it("Tests the payload is returned upon successful save for http.", function () {
                return SpokesService.savePipe(user, source, { url: "http://spoke.url/" }, true)
                    .then(function (payload: Spoke) {
                        expect(payload).to.exist;
                    });
            });

            it("Tests the payload is returned upon successful save for lambda.", function () {
                return SpokesService.savePipe(user, source, { lambdaARN: "testARN", awsAccessKey: "ABC123", awsSecretKey: "123ABC" }, true)
                    .then(function (payload: Spoke) {
                        expect(payload).to.exist;
                    });
            });

            it("Tests the proper header is sent", function () {
                return SpokesService.savePipe(user, source, { url: "http://spoke.url/" }, true)
                    .then(function (payload: Spoke) {
                        const args = fetchMock.lastCall()[1] as RequestInit;
                        const headers = args.headers as any;
                        expect(args.method).to.equal("POST");
                        expect(headers["Content-Type"]).to.equal("application/json");
                        expect(headers["x-access-userid"]).to.equal(user.userId);
                    });
            });

            it("Tests that an error is thrown when an invalid user is not provided.", function () {
                const copyUser = { ...user, ...{ userId: undefined } };
                let caughtError: Error;
                return SpokesService.savePipe(copyUser, source, { url: "http://spoke.url/" }, true)
                    .catch(function (err: Error) {
                        caughtError = err;
                    }).then(function () {
                        expect(caughtError).to.exist;
                    });
            });

            it("Tests the proper post object was sent by the service is correct for HTTP.", function () {
                return SpokesService.savePipe(user, source, { url: "http://spoke.url/" }, true)
                    .then(function (payload: Spoke) {
                        const args = fetchMock.lastCall()[1] as RequestInit;
                        const reqObj = JSON.parse(args.body);
                        expect(reqObj).to.exist;
                        expect(reqObj.diagnosticsKey).to.equal(source.secretKey);
                        expect(reqObj.uuid).to.equal(source.secretKey);
                        expect(reqObj.endPoint).to.deep.equal({ name: source.id });
                        expect(reqObj.pipeType).to.equal("HTTP");
                        expect(reqObj.path).to.equal("/");
                        expect(reqObj.proxy).to.equal(true);
                        expect(reqObj.http).to.deep.equal({ url: "http://spoke.url/" });
                        expect(reqObj.lambda).to.not.exist;
                    });
            });

            it("Tests the proper post object was sent by the service is correct for lamdba.", function () {
                return SpokesService.savePipe(user, source, { lambdaARN: "testARN", awsAccessKey: "ABC123", awsSecretKey: "123ABC" }, true)
                    .then(function (payload: Spoke) {
                        const args = fetchMock.lastCall()[1] as RequestInit;
                        const reqObj = JSON.parse(args.body);
                        expect(reqObj).to.exist;
                        expect(reqObj.diagnosticsKey).to.equal(source.secretKey);
                        expect(reqObj.uuid).to.equal(source.secretKey);
                        expect(reqObj.endPoint).to.deep.equal({ name: source.id });
                        expect(reqObj.pipeType).to.equal("LAMBDA");
                        expect(reqObj.path).to.equal("/");
                        expect(reqObj.proxy).to.equal(true);
                        expect(reqObj.lambda).to.deep.equal({ lambdaARN: "testARN", awsAccessKey: "ABC123", awsSecretKey: "123ABC" });
                        expect(reqObj.http).to.not.exist;
                    });
            });

            it("Tests the Spoke returned by the service is correct for HTTP.", function () {
                return SpokesService.savePipe(user, source, { url: "http://spoke.url/" }, true)
                    .then(function (payload: Spoke) {
                        expect(payload).to.exist;
                        expect(payload.diagnosticsKey).to.equal(fetchResponse.diagnosticsKey);
                        expect(payload.uuid).to.equal(fetchResponse.uuid);
                        expect(payload.endPoint).to.deep.equal(fetchResponse.endPoint);
                        expect(payload.pipeType).to.equal(fetchResponse.pipeType);
                        expect(payload.proxy).to.equal(fetchResponse.proxy);
                        expect(payload.path).to.equal("/"); // This is always "/" currently in the API.
                        expect(payload.http).to.deep.equal({ url: "http://spoke.url/" });
                        expect((payload as any).lambda).to.not.exist;
                    });
            });

            it("Tests the Spoke returned by the service is correct for lambda.", function () {
                return SpokesService.savePipe(user, source, { lambdaARN: "testARN", awsAccessKey: "ABC123", awsSecretKey: "123ABC" }, true)
                    .then(function (payload: Spoke) {
                        expect(payload).to.exist;
                        expect(payload.diagnosticsKey).to.equal(fetchResponse.diagnosticsKey);
                        expect(payload.uuid).to.equal(fetchResponse.uuid);
                        expect(payload.endPoint).to.deep.equal(fetchResponse.endPoint);
                        expect(payload.proxy).to.equal(fetchResponse.proxy);
                        expect(payload.path).to.equal("/"); // This is always "/" currently in the API.
                        expect(payload.pipeType).to.equal("LAMBDA");
                        expect(payload.lambda).to.deep.equal({ lambdaARN: "testARN", awsAccessKey: "ABC123", awsSecretKey: undefined});
                        expect((payload as any).http).to.not.exist;
                    });
            });

            describe("Error checking", function () {
                it("Tests that an error is thrown when user is undefined.", function () {
                    let caughtError: Error;
                    return SpokesService.savePipe(undefined, source, { url: "http://spoke.url/" }, true)
                        .catch(function (err: Error) {
                            caughtError = err;
                        }).then(function () {
                            expect(caughtError).to.exist;
                        });
                });

                it("Tests that an error is thrown when source is undefined.", function () {
                    const copyUser = { ...user };
                    let caughtError: Error;
                    return SpokesService.savePipe(copyUser, undefined, { url: "http://spoke.url/" }, true)
                        .catch(function (err: Error) {
                            caughtError = err;
                        }).then(function () {
                            expect(caughtError).to.exist;
                        });
                });

                it("Tests that an error is thrown when source is undefined.", function () {
                    const copyUser = { ...user };
                    let caughtError: Error;
                    return SpokesService.savePipe(copyUser, undefined, { url: "http://spoke.url/" }, true)
                        .catch(function (err: Error) {
                            caughtError = err;
                        }).then(function () {
                            expect(caughtError).to.exist;
                        });
                });

                it("Tests that an error is thrown when source does not have a secret key.", function () {
                    const copyUser = { ...user };
                    const copySource = { ...source, ...{ secretKey: undefined } };
                    let caughtError: Error;
                    return SpokesService.savePipe(copyUser, copySource, { url: "http://spoke.url/" }, true)
                        .catch(function (err: Error) {
                            caughtError = err;
                        }).then(function () {
                            expect(caughtError).to.exist;
                        });
                });

                it("Tests that an error is thrown when source does not have an ID.", function () {
                    const copyUser = { ...user };
                    const copySource = { ...source, ...{ id: undefined } };
                    let caughtError: Error;
                    return SpokesService.savePipe(copyUser, copySource, { url: "http://spoke.url/" }, true)
                        .catch(function (err: Error) {
                            caughtError = err;
                        }).then(function () {
                            expect(caughtError).to.exist;
                        });
                });
            });
        });
    });

    describe("Error returns", function () {
        describe("Fetch Pipe", function () {
            before(function () {
                fetchMock.get(/https:\/\/api.bespoken.link\/pipe\/.*/, mockFetchNotFoundResponse);
            });

            afterEach(function () {
                fetchMock.reset();
            });

            after(function () {
                fetchMock.restore();
            });

            it("Tests the promise rejects upon not found.", function () {
                let caughtError: Error;
                return SpokesService.fetchPipe(user, source)
                    .catch(function (err: Error) {
                        caughtError = err;
                    }).then(function () {
                        expect(caughtError).to.exist;
                    });
            });
        });

        describe("Save Pipe", function () {
            before(function () {
                fetchMock.post(/https:\/\/api.bespoken.link\/pipe/, mockSaveNotCreatedResponse);
            });

            afterEach(function () {
                fetchMock.reset();
            });

            after(function () {
                fetchMock.restore();
            });

            it("Tests the promise rejects upon not saved.", function () {
                let caughtError: Error;
                return SpokesService.savePipe(user, source, { lambdaARN: "testARN", awsAccessKey: "ABC123", awsSecretKey: "123ABC" }, true)
                    .catch(function (err: Error) {
                        caughtError = err;
                    }).then(function () {
                        expect(caughtError).to.exist;
                    });
            });
        });
    });

    describe("Error returns", function () {
        describe("Fetch Pipe", function () {
            before(function () {
                fetchMock.get(/https:\/\/api.bespoken.link\/pipe\/.*/, mockFetchError);
            });

            afterEach(function () {
                fetchMock.reset();
            });

            after(function () {
                fetchMock.restore();
            });

            it("Tests the promise rejects upon network error..", function () {
                let caughtError: Error;
                return SpokesService.fetchPipe(user, source)
                    .catch(function (err: Error) {
                        caughtError = err;
                    }).then(function () {
                        expect(caughtError).to.exist;
                    });
            });
        });

        describe("Save Pipe", function () {
            before(function () {
                fetchMock.post(/https:\/\/api.bespoken.link\/pipe/, mockSaveError);
            });

            afterEach(function () {
                fetchMock.reset();
            });

            after(function () {
                fetchMock.restore();
            });

            it("Tests the promise rejects upon network error.", function () {
                let caughtError: Error;
                return SpokesService.savePipe(user, source, { lambdaARN: "testARN", awsAccessKey: "ABC123", awsSecretKey: "123ABC" }, true)
                    .catch(function (err: Error) {
                        caughtError = err;
                    }).then(function () {
                        expect(caughtError).to.exist;
                    });
            });
        });
    });
});
