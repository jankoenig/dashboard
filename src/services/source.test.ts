import * as chai from "chai";
import * as fetchMock from "fetch-mock";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import * as SourceModel from "../models/source";
import remoteservice from "./remote-service";
import SourceService from "./source";

chai.use(sinonChai);
let expect = chai.expect;

/**
 * Convience method to generate the props with a unique ID.
 *
 * @param {string} The ID to put.
 */
function generateSourceProps(sourceId: string = undefined, members: SourceModel.Members = {}): SourceModel.SourceProperties {
    let props: SourceModel.SourceProperties = {
        secretKey: "SuperSecretKey",
        name: "Test Source",
        members: members,
        profile: undefined,
        id: sourceId,
        created: new Date()
    };
    return props;
};

/**
 * The User to be defined as the current logged in user.
 */
let mockUser: remoteservice.user.User = {
    emailVerified: true,
    displayName: "testUsers",
    email: "test@testdomain.test",
    photoURL: undefined,
    providerId: "ABC123",
    uid: "ABCD1234567890"
};

/**
 * A promise to simulate the database returning a single source along with the other objects it may
 * return as well.
 */
function successResponseSourcePromise(id?: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        resolve({
            code: 200,
            val(): any {
                return generateSourceProps(id);
            }
        });
    });
}

/**
 * A promise to simulate the database returning a collection of sources along with the other objects it may
 * return as well.
 */
function successResponseSourcesArrayPromise(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        let objs: SourceModel.SourceProperties[] = [];

        for (let i = 0; i < 10; ++i) {
            objs.push(generateSourceProps("TestSourceId" + i));
        }

        resolve({
            code: 200,
            val(): any {
                return objs;
            }
        });
    });
}

/**
 * A response promise that will return the response given when requesting all the owned sources.
 */
function successGetOwnedSourcesPromise(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        let obj: any = {};

        for (let i = 0; i < 10; ++i) {
            obj["TestSourceId" + i] = "owner";
        }
        resolve({
            val(): any {
                return obj;
            }
        });
    });
}

function successResponsePromise(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        resolve({
            code: 200,
            message: "Success"
        });
    });
}

function errorResponsePromise(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        reject(Error("Error thrown per requirements of the test."));
    });
}

const mockAuth: remoteservice.auth.Auth = <remoteservice.auth.Auth>{
    get currentUser() {
        return mockUser;
    }
};

describe("Source Service", function () {

    let db: remoteservice.database.Database;
    let ref: remoteservice.database.Reference;

    beforeEach(function () {
        db = <remoteservice.database.Database>{};
        ref = <remoteservice.database.Reference>{};

        db.ref = sinon.stub().returns(ref);
        ref.child = sinon.stub().returns(ref);
    });

    describe("Tests the generate source ID function.", function () {
        let mockResponse: any;

        before(function () {
            mockResponse = { id: "test-source-bhjas3", secretKey: "ABC123456" };
            fetchMock.get(/http:\/\/ELB-ECS-SourceNameGenerator-dev-905620013.us-east-1.elb.amazonaws.com\/v1\/sourceId\?.*/, mockResponse);
        });

        after(function () {
            fetchMock.restore();
        });

        it("Tests the resource is returned.", function () {
            return SourceService.generateSourceId()
                .then(function (resource: SourceService.SourceName) {
                    expect(resource).to.exist;
                    console.log(resource);
                    expect(resource.id).to.equal("test-source-bhjas3");
                    expect(resource.secretKey).to.equal("ABC123456");
                });
        });
    });

    describe("Tests the createSource function.", function () {

        describe("Tests successful create responses.", function () {

            let mockResponse: any;

            before(function () {
                mockResponse = { id: "test-source-bhjas3", secretKey: "ABC123456" };
                fetchMock.get(/http:\/\/ELB-ECS-SourceNameGenerator-dev-905620013.us-east-1.elb.amazonaws.com\/v1\/sourceId\?.*/, mockResponse);
            });

            beforeEach(function () {
                ref.set = sinon.stub().returns(successResponsePromise());
            });

            after(function () {
                fetchMock.restore();
            });

            it("Creates a new Source", function () {
                return SourceService.createSource(new SourceModel.Source(generateSourceProps()), mockAuth, db)
                    .then(function (source: SourceModel.Source) {
                        expect(source.id).to.equal("test-source-bhjas3"); // "The default "slugged" name is the source name made in to a URL format.
                        expect(source.secretKey).to.equal("ABC123456");
                        expect(source.members[mockAuth.currentUser.uid]).to.equal("owner");
                    });
            });

            it("Sends the appropriate source to Firebase.", function () {
                return SourceService.createSource(new SourceModel.Source(generateSourceProps()), mockAuth, db)
                    .then(function (source: SourceModel.Source) {
                        // In order for these to be set, the firebase url "/sources/<sourceID>" must be set to "source" (checked above)
                        // Immediately following the setting, the firebase url "users/<userID>/sources/<sourceID>" must be set to "owner"
                        const childArgs = (ref.child as Sinon.SinonStub).args;
                        const setargs = (ref.set as Sinon.SinonStub).args;
                        // Check the first setting.
                        expect(childArgs[0][0]).to.equal("sources");
                        expect(childArgs[1][0]).to.equal("test-source-bhjas3");
                        expect(setargs[0][0]).to.deep.equal(source);

                        // Check the second setting.
                        expect(childArgs[2][0]).to.equal("users");
                        expect(childArgs[3][0]).to.equal(mockAuth.currentUser.uid);
                        expect(childArgs[4][0]).to.equal("sources");
                        expect(childArgs[5][0]).to.equal("test-source-bhjas3");
                        expect(setargs[1][0]).to.equal("owner");
                    });
            });
        });
    });

    describe("Tests the \"deleteSource\" function.", function () {
        let childStub: Sinon.SinonStub;
        let setStub: Sinon.SinonStub;
        let source = generateSourceProps();

        beforeEach(function () {
            const owner: SourceModel.Members = {};
            owner[mockUser.uid] = "owner";
            owner["123ABC"] = "visitor";
            owner["234BCD"] = "visitor";
            owner["345CDE"] = "visitor";
            owner["456DEF"] = "visitor";

            childStub = sinon.stub().returns(ref);
            setStub = sinon.stub().returns(successResponsePromise());
            source = generateSourceProps("ABC123", owner);

            ref.child = childStub;
            ref.set = setStub;
        });

        describe("Success", function () {
            it("Tests the delete when to the appropriate Firebase url.", function () {
                return SourceService.deleteSource(new SourceModel.Source(source), mockAuth, db)
                    .then(function (source: SourceModel.Source) {
                        // Deleting happens at "users/<uid>/sources/<source.id>";
                        const firstCall = childStub.firstCall;
                        expect(firstCall).to.be.calledWith("users");

                        const secondCall = childStub.secondCall;
                        expect(secondCall).to.be.calledWith(mockAuth.currentUser.uid);

                        const thirdCall = childStub.thirdCall;
                        expect(thirdCall).to.be.calledWith("sources");

                        const fourthCall = childStub.getCall(3);
                        expect(fourthCall).to.be.calledWith(source.id);

                    });
            });

            it("Tests the delete sent a null to the Firebase url.", function () {
                return SourceService.deleteSource(new SourceModel.Source(source), mockAuth, db)
                    .then(function (source: SourceModel.Source) {
                        // tslint:disable:no-null-keyword
                        expect(setStub).to.be.calledWith(null);
                        // tslint:enable:no-null-keyword
                    });
            });

            it("Tests the returned source has been updated.", function () {
                return SourceService.deleteSource(new SourceModel.Source(source), mockAuth, db)
                    .then(function (source: SourceModel.Source) {
                        expect(source.members[mockUser.uid]).to.not.exist;
                    });
            });
        });

        describe("Unsuccessful", function () {

        });
    });

    describe("Tests the \"getSources\" function.", function () {
        it("Tests the get sources function with a successful payload.", function () {
            ref.once = sinon.stub().returns(successResponseSourcesArrayPromise());

            return SourceService.getSources(mockAuth, db).then(function (retVal: any) {
                expect(ref.child).to.be.calledWith("/users/" + mockUser.uid + "/sources");
                expect(retVal).to.not.be.undefined;
            });
        });

        it("Tests the get sources function with a successful payload.", function () {
            ref.once = sinon.stub().returns(errorResponsePromise());

            return SourceService.getSources(mockAuth, db).catch(function (retVal: any) {
                expect(ref.child).to.be.calledWith("/users/" + mockUser.uid + "/sources");
                expect(retVal).to.not.be.undefined;
            });
        });
    });

    describe("Tests the \"getSourcesObj\" function.", function () {

        /**
         * The "getSource" must return an individual source from the url "/source/{sourceId}" so we're
         * going to put that in to the stub for each available source.
         */
        beforeEach(function () {
            let mainStub: Sinon.SinonStub = sinon.stub().withArgs("/sources/").returns(errorResponsePromise());
            for (let i = 0; i < 10; i++) {
                let subRef = <remoteservice.database.Reference>{};
                subRef.once = sinon.stub().returns(successResponseSourcePromise("TestSourceId" + i));

                // First call should be the call to get all object keys.  All subsequent calls should be to get the actual object.
                mainStub.onCall(i + 1).returns(subRef);
                // mainStub.withArgs("/sources/TestSourceId" + i).returns(subRef);
            }
            ref.child = mainStub;
        });

        it("Tests the get sources object function with a successful payload.", function () {
            let subRef = <remoteservice.database.Reference>{};
            subRef.once = sinon.stub().returns(successGetOwnedSourcesPromise());

            (<Sinon.SinonStub>ref.child).onFirstCall().returns(subRef);

            return SourceService.getSourcesObj(mockAuth, db).then(function (sources: SourceModel.Source[]) {
                expect(ref.child).to.be.callCount(11);
                expect(ref.child).to.be.calledWith("/users/" + mockUser.uid + "/sources");
                expect(sources.length).to.equal(10); // The side that the main promise returns.
            });
        });

        it("Tests the get sources function with an unsuccessful payload.", function () {
            let subRef = <remoteservice.database.Reference>{};
            subRef.once = sinon.stub().returns(errorResponsePromise());

            (<Sinon.SinonStub>ref.child).returns(subRef);

            return SourceService.getSourcesObj(mockAuth, db).catch(function (retVal: any) {
                expect(ref.child).to.be.callCount(1);
                expect(ref.child).to.be.calledWith("/users/" + mockUser.uid + "/sources");
                expect(retVal).to.not.be.undefined;
            });
        });
    });

    describe("Testing the \"getSource\" method.", function () {

        it("Tests a successful response for Get Source.", function () {

            ref.once = sinon.stub().returns(successResponseSourcePromise("TestSourceId"));

            return SourceService.getSource("TestSourceId", db).then(function (obj: any) {
                expect(ref.once).to.be.calledOnce;
                expect(ref.child).to.be.calledOnce;
                expect(ref.child).to.be.calledWith("/sources/TestSourceId");
                expect(obj).to.not.be.undefined;
                expect(obj.val()).to.not.be.undefined;
            });
        });

        it("Tests an unsuccessful response for Get Source.", function () {

            ref.once = sinon.stub().returns(errorResponsePromise());

            return SourceService.getSource("TestSourceId", db).catch(function (obj: any) {
                expect(ref.once).to.be.calledOnce;
                expect(ref.child).to.be.calledOnce;
                expect(ref.child).to.be.calledWith("/sources/TestSourceId");
                expect(obj).to.not.be.undefined;
                expect(obj).to.be.a("Error");
            });
        });
    });

    describe("Testing the \"getSourceObj\" method.", function () {

        it("Tests a successful response for Get Source.", function () {

            ref.once = sinon.stub().returns(successResponseSourcePromise("TestSourceId"));

            return SourceService.getSourceObj("TestSourceId", db).then(function (obj: SourceModel.Source) {
                expect(ref.once).to.be.calledOnce;
                expect(ref.child).to.be.calledOnce;
                expect(ref.child).to.be.calledWith("/sources/TestSourceId");
                expect(obj).to.not.be.undefined;
                expect(obj.id).to.equal("TestSourceId");
            });
        });

        it("Tests an unsuccessful response for Get Source.", function () {

            ref.once = sinon.stub().returns(errorResponsePromise());

            return SourceService.getSourceObj("TestSourceId", db).catch(function (obj: any) {
                expect(ref.once).to.be.calledOnce;
                expect(ref.child).to.be.calledOnce;
                expect(ref.child).to.be.calledWith("/sources/TestSourceId");
                expect(obj).to.not.be.undefined;
                expect(obj).to.be.a("Error");
            });
        });
    });
});