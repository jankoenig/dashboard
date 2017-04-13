import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";

import ConvoPage from "../pages/logspage/ConvoPage";
import ConvoRoute from "./ConvoRoute";

const expect = chai.expect;

describe("ConvoRoute", function () {
    describe("Render", function () {

        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            // The route doesn't use any of these
            wrapper = shallow(<ConvoRoute
                history={undefined}
                match={undefined}
                location={undefined}
            />);
        });

        it("Tests that the Convo Page is shown.", function () {
            expect(wrapper.find(ConvoPage)).to.have.length(1);
        });
    });
});