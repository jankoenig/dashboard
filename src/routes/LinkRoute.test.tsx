import * as Bluebird from "bluebird";
import * as chai from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import Source from "../models/source";
import User from "../models/user";
import SourceService from "../services/source";
import { dummySources } from "../utils/test";
import { LinkRoute }from "./LinkRoute";

chai.use(sinonChai);
const expect = chai.expect;

describe("Route", function () {

    describe("With Link Routing", function () {
        let returnSources: Source[];
        let getSources: sinon.SinonStub;
        let linkSource: sinon.SinonStub;
        let goTo: sinon.SinonStub;
        let user: User;

        before(function () {
            user = {
                userId: "ABC123",
                email: "test@test.com"
            };
            returnSources = dummySources(6);
            goTo = sinon.stub();
            getSources = sinon.stub(SourceService, "getSourcesObj").returns(Promise.resolve(returnSources));
            linkSource = sinon.stub(SourceService, "linkSource").returns({ user: { userId: user.userId }, source: returnSources[3] });
        });

        afterEach(function () {
            goTo.reset();
        });

        after(function () {
            linkSource.restore();
            getSources.restore();
        });

        it("Tests that the LinkSource method gets called with the appropriate parameters.", function () {
            const params = { id: returnSources[3].id, key: returnSources[3].secretKey };
            const match = {isExact: false, params: params, path: "/test", url: "https://dashboard/test?id=" + returnSources[3].id + "&key=" + returnSources[3].secretKey};
            const wrapper = shallow(<LinkRoute
                history={undefined} // Not used
                location={undefined} // not used
                match={match}
                currentUser={user} goTo={goTo} />);

            const instance = wrapper.instance() as LinkRoute;
            return (instance.cancelables[0] as Bluebird<any>).finally(function () {
                const sourceArg = linkSource.args[0][0];
                expect(sourceArg).to.exist;
                expect(sourceArg.id).to.equal(returnSources[3].id);
                expect(sourceArg.secretKey).to.equal(returnSources[3].secretKey);

                const userArg = linkSource.args[0][1];
                expect(userArg).to.exist;
                expect(userArg.userId).to.equal(user.userId);
            });
        });

        it("Tests that it goes to the link sourced upon success", function () {
            const params = { id: returnSources[3].id, key: returnSources[3].secretKey };
            const match = {isExact: false, params: params, path: "/test", url: "https://dashboard/test?id=" + returnSources[3].id + "&key=" + returnSources[3].secretKey};
            const wrapper = shallow(<LinkRoute
                history={undefined} // Not used
                location={undefined} // not used
                match={match}
                currentUser={user} goTo={goTo} />);

            const instance = wrapper.instance() as LinkRoute;
            return (instance.cancelables[0] as Bluebird<any>).finally(function () {
                expect(goTo).to.be.calledWith("/skills/" + returnSources[3].id);
            });
        });
    });

    describe("No link Routing", function () {
        let returnSources: Source[];
        let getSources: sinon.SinonStub;
        let linkSource: sinon.SinonStub;
        let goTo: sinon.SinonStub;
        let user: User;

        before(function () {
            returnSources = dummySources(6);
            goTo = sinon.stub();
            getSources = sinon.stub(SourceService, "getSourcesObj").returns(Promise.resolve(returnSources));
            linkSource = sinon.stub(SourceService, "linkSource").returns(Promise.reject(new Error("Error per requirements of the test.")));
            user = {
                userId: "ABC123",
                email: "test@test.com"
            };
        });

        afterEach(function () {
            goTo.reset();
        });

        after(function () {
            linkSource.restore();
            getSources.restore();
        });

        it("Tests default route when no parameters in place.", function () {
            const params = { };
            const match = {isExact: false, params: params, path: "/test", url: "https://dashboard/test?key=" + returnSources[3].secretKey};
            // It calls it on mount.
            shallow(<LinkRoute
                history={undefined} // Not used
                location={undefined} // not used
                match={match}
                currentUser={user} goTo={goTo} />);

            expect(goTo).to.have.been.calledWith("/skills");
        });

        it("Tests default route when when only ID exists.", function () {
            const params = { id: returnSources[3].id };
            const match = {isExact: false, params: params, path: "/test", url: "https://dashboard/test?id=" + returnSources[3].id};
            const wrapper = shallow(<LinkRoute
                history={undefined} // Not used
                location={undefined} // not used
                match={match}
                currentUser={user} goTo={goTo} />);

            const instance = wrapper.instance() as LinkRoute;

            return (instance.cancelables[0] as Bluebird<any>).finally(function () {
                expect(goTo).to.have.been.calledWith("/notFound");
            });
        });

        it("Tests default route when when only key exists exists.", function () {
            const params = { key: returnSources[3].secretKey };
            const match = {isExact: false, params: params, path: "/test", url: "https://dashboard/test?key=" + returnSources[3].secretKey};
            const wrapper = shallow(<LinkRoute
                history={undefined} // Not used
                location={undefined} // not used
                match={match}
                currentUser={user} goTo={goTo} />);

            const instance = wrapper.instance() as LinkRoute;

            return (instance.cancelables[0] as Bluebird<any>).finally(function () {
                expect(goTo).to.have.been.calledWith("/notFound");
            });
        });

        it("Tests it routes to the skill when found.", function () {
            const params = { id: returnSources[3].id, key: returnSources[3].secretKey };
            const match = {isExact: false, params: params, path: "/test", url: "https://dashboard/test?id=" + returnSources[3].id + "&key=" + returnSources[3].secretKey};
            const wrapper = shallow(<LinkRoute
                history={undefined} // Not used
                location={undefined} // not used
                match={match}
                currentUser={user} goTo={goTo} />);

            const instance = wrapper.instance() as LinkRoute;

            return (instance.cancelables[0] as Bluebird<any>).finally(function () {
                expect(goTo).to.have.been.calledWith("/skills/" + returnSources[3].id);
            });
        });

        it("Tests it routes to the default when both parameters exist and not found.", function () {
            const params = { id: returnSources[3].id, key: "gibberish" };
            const match = {isExact: false, params: params, path: "/test", url: "https://dashboard/test?id=" + returnSources[3].id + "&key=" + returnSources[3].secretKey};
            const wrapper = shallow(<LinkRoute
                history={undefined} // Not used
                location={undefined} // not used
                match={match}
                currentUser={user} goTo={goTo} />);

            const instance = wrapper.instance() as LinkRoute;

            return (instance.cancelables[0] as Bluebird<any>).finally(function () {
                expect(goTo).to.have.been.calledWith("/notFound");
            });
        });
    });
});