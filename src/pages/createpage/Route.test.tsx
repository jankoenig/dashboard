import * as chai from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import Source from "../../models/source";
import { dummySources } from "../../utils/test";
import { CreateOrRoute } from "./CreateOrRoute";

chai.use(sinonChai);
const expect = chai.expect;

describe("Route", function () {
    describe("Routing", function () {
        let goTo: Sinon.SinonStub;

        before(function () {
            goTo = sinon.stub();
        });

        afterEach(function () {
            goTo.reset();
        });

        it("Tests default route when no parameters in place.", function () {
            const sources: Source[] = [];
            const location = { query: {} };
            // It calls it on mount.
            shallow(<CreateOrRoute sources={sources} goTo={goTo} location={location} />);

            expect(goTo).to.have.been.calledWith("/skills");
        });

        it("Tests default route when when only ID exists.", function () {
            const sources: Source[] = dummySources(5);
            const location = { query: { id: sources[0].id } };
            // It calls it on mount.
            shallow(<CreateOrRoute sources={sources} goTo={goTo} location={location} />);

            expect(goTo).to.have.been.calledWith("/skills");
        });

        it("Tests default route when when only key exists exists.", function () {
            const sources: Source[] = dummySources(5);
            const location = { query: { key: sources[0].secretKey } };
            // It calls it on mount.
            shallow(<CreateOrRoute sources={sources} goTo={goTo} location={location} />);

            expect(goTo).to.have.been.calledWith("/skills");
        });

        it("Tests it routes to the skill when found.", function () {
            const sources: Source[] = dummySources(5);
            const location = { query: { id: sources[3].id, key: sources[3].secretKey } };
            // It calls it on mount.
            const wrapper = shallow(<CreateOrRoute sources={sources} goTo={goTo} location={location} />);
            const instance = wrapper.instance() as CreateOrRoute;

            return (instance.cancelables[0] as any).then(function() {
                expect(goTo).to.have.been.calledWith("/skills/" + sources[3].id);
            });
        });

        it("Tests it routes to the default when both parameters exist and not found.", function () {
            const sources: Source[] = dummySources(5);
            const location = { query: { id: sources[3].id, key: "gibberish" } };
            // It calls it on mount.
            const wrapper = shallow(<CreateOrRoute sources={sources} goTo={goTo} location={location} />);
            const instance = wrapper.instance() as CreateOrRoute;

            return (instance.cancelables[0] as any).then(function() {
                expect(goTo).to.have.been.calledWith("/skills");
            });
        });
    });
});