import * as Bluebird from "bluebird";
import * as chai from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import Source from "../../models/source";
import User from "../../models/user";
import SourceService from "../../services/source";
import { dummySources } from "../../utils/test";
import { CreateOrRoute } from "./CreateOrRoute";

chai.use(sinonChai);
const expect = chai.expect;

describe("Route", function () {
    describe("No link Routing", function () {
        let returnSources: Source[];
        let getSources: Sinon.SinonStub;
        let linkSource: Sinon.SinonStub;
        let goTo: Sinon.SinonStub;
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

        after(function() {
            linkSource.restore();
            getSources.restore();
        });

        it("Tests default route when no parameters in place.", function () {
            const location = { query: {} };
            // It calls it on mount.
            shallow(<CreateOrRoute currentUser={user} goTo={goTo} location={location} />);
            expect(goTo).to.have.been.calledWith("/skills");
        });

        it("Tests default route when when only ID exists.", function () {
            const location = { query: { id: returnSources[0].id } };
            // It calls it on mount.
            const wrapper = shallow(<CreateOrRoute currentUser={user} goTo={goTo} location={location} />);
            const instance = wrapper.instance() as CreateOrRoute;

            return (instance.cancelables[0] as Bluebird<any>).finally(function () {
                expect(goTo).to.have.been.calledWith("/notFound");
            });
        });

        it("Tests default route when when only key exists exists.", function () {
            const location = { query: { key: returnSources[0].secretKey } };
            // It calls it on mount.
            const wrapper = shallow(<CreateOrRoute currentUser={user} goTo={goTo} location={location} />);
            const instance = wrapper.instance() as CreateOrRoute;

            return (instance.cancelables[0] as Bluebird<any>).finally(function () {
                expect(goTo).to.have.been.calledWith("/notFound");
            });
        });

        it("Tests it routes to the skill when found.", function () {
            const location = { query: { id: returnSources[3].id, key: returnSources[3].secretKey } };
            // It calls it on mount.
            const wrapper = shallow(<CreateOrRoute currentUser={user} goTo={goTo} location={location} />);
            const instance = wrapper.instance() as CreateOrRoute;

            return (instance.cancelables[0] as Bluebird<any>).finally(function () {
                expect(goTo).to.have.been.calledWith("/skills/" + returnSources[3].id);
            });
        });

        it("Tests it routes to the default when both parameters exist and not found.", function () {
            const location = { query: { id: returnSources[3].id, key: "gibberish" } };
            // It calls it on mount.
            const wrapper = shallow(<CreateOrRoute currentUser={user} goTo={goTo} location={location} />);
            const instance = wrapper.instance() as CreateOrRoute;

            return (instance.cancelables[0] as Bluebird<any>).finally(function () {
                expect(goTo).to.have.been.calledWith("/notFound");
            });
        });
    });
});