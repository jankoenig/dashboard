import * as chai from "chai";
import { shallow } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable

import NotFoundPage from "./NotFoundPage";

let expect = chai.expect;

describe("Not Found Page", function() {
    it("should render correctly", function() {
        const wrapper = shallow(<NotFoundPage />);
        expect(wrapper.type()).to.equal("div");
    });
});
