import * as chai from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import * as sinonChai from "sinon-chai";

import WelcomePage from "./WelcomePage";

// Setup chai with sinon-chai
chai.use(sinonChai);
let expect = chai.expect;

describe("HomePage", function () {
    it("should render correctly", function () {
        const wrapper = shallow(
            <WelcomePage/>
        );

        expect(wrapper.find("h3")).to.have.length(1);
        expect(wrapper.find("li").at(3).text()).to.equal("Setup your Lambda or Cloud Function for Logless");
        // Hurray! It rendered.
    });
});
