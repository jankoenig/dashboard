import * as chai from "chai";
import { shallow } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable
import * as sinonChai from "sinon-chai";

import HomePage from "./HomePage";

// Setup chai with sinon-chai
chai.use(sinonChai);
let expect = chai.expect;

describe("Logs Page", function () {
    it("should render correctly", function () {
        const wrapper = shallow(
            <HomePage/>
        );

        expect(wrapper.find("div")).to.have.length(1);
        // Hurray! It rendered.
    });
});