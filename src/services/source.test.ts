import * as chai from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import * as SourceModel from "../models/source";
import utils from "../utils";
import * as SourceService from "./source";
import remoteservice from "./remote-service";

chai.use(sinonChai);
let expect = chai.expect;

function generateSourceProps(sourceId?: string): SourceModel.SourceProperties {
    return {
        secretKey: "SuperSecretKey",
        name: "Test Source",
        members: undefined,
        profile: undefined,
        id: sourceId ? sourceId : undefined,
        created: new Date()
    };
};

let mockUser: remoteservice.user.User = {
    emailVerified: true,
    displayName: "testUsers",
    email: "test@testdomain.test",
    photoURL: undefined,
    providerId: "ABC123",
    uid: "ABCD1234567890"
};

const mockSource: SourceModel.Source = new SourceModel.Source(generateSourceProps("test-source"));

new Promise<any>((resolve, reject) => {
    console.info("SUCCESS PROMISE");
    resolve({
        success: true
    });
});

const successSingleSourcePromise = new Promise<SourceModel.Source>((resolve, reject) => {
    resolve(mockSource);
});

const successSourceArrayPromise = new Promise<SourceModel.Source[]>((resolve, reject) => {
    let objs: SourceModel.Source[] = [];

    for (let i = 0; i < 10; ++i) {
        objs.push(new SourceModel.Source(generateSourceProps("TestSourceId" + i)));
    }

    resolve(objs);
});

const successResponsePromise = new Promise<any>((resolve, reject) => {
    resolve({
        code: 200,
        message: "Success"
    });
});

const errorResponsePromise = new Promise<any>((resolve, reject) => {
    reject(Error("Error thrown per requirements of the test."));
});

const mockAuth: remoteservice.auth.Auth = <remoteservice.auth.Auth>{
    get currentUser() {
        return mockUser;
    }
};

describe("Source Service", function () {

    let db: remoteservice.database.Database;
    let ref: remoteservice.database.Reference;

    beforeEach(function () {
        db = <remoteservice.database.Database> {};
        ref = <remoteservice.database.Reference> {};

        db.ref = sinon.stub().returns(ref);
        ref.child = sinon.stub().returns(ref);
    });

    describe("Tests the createSource function.", function () {

        describe("Tests successful create responses.", function () {
            beforeEach(function () {
                ref.set = sinon.stub().returns(successResponsePromise);
            });

            it("Creates a new Source", function () {
                // It will only create a stub if it can't find a Source with the given slug.  That's determined by an error when queried.
                ref.once = sinon.stub().returns(errorResponsePromise);

                return SourceService.default.createSource(mockSource, mockAuth, db)
                    .then(function (source: SourceModel.Source) {
                        expect(ref.once).to.be.calledOnce;
                        expect(source.id).to.equal("test-source"); // "The default "slugged" name is the source name made in to a URL format.
                    });
            });

            it ("Creates a new Source when the slug already exists.", function() {
                let onceStub = sinon.stub().returns(errorResponsePromise);
                onceStub.onFirstCall().returns(successSingleSourcePromise);
                ref.once = onceStub;

                return SourceService.default.createSource(mockSource, mockAuth, db)
                    .then(function (source: SourceModel.Source) {

                        let base = "test-source";
                        let firstPart = source.id.substr(0, base.length);
                        let extension = source.id.substr(base.length);

                        expect(onceStub).to.be.calledTwice;
                        expect(firstPart).to.equal(base);
                        expect(extension.length).to.equal(6); // 5 ID numbers + dash (-).
                    });
            });

            it ("Creates a new Source when the first hundred slugs exist.", function() {
                let onceStub = sinon.stub().returns(successResponsePromise);
                onceStub.onCall(100).returns(errorResponsePromise);
                ref.once = onceStub;

                return SourceService.default.createSource(mockSource, mockAuth, db)
                    .then(function (source: SourceModel.Source) {

                        let base = "test-source";
                        let firstPart = source.id.substr(0, base.length);
                        let extension = source.id.substr(base.length);

                        expect(ref.once).to.be.callCount(101);
                        expect(firstPart).to.equal(base);
                        expect(extension.length).to.equal(16); // ID number increases by 1 every 10 calls.  It should increase 10 times. (5 x 10) + dash (-).
                    });
            });
        });
    });
});