import * as chai from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import NotFoundPage from "./NotFoundPage";

let expect = chai.expect;

describe("Not Found Page", function() {
    it("should render correctly", function() {
        const wrapper = shallow(<NotFoundPage />);
        expect(wrapper.type()).to.equal("div");
    });
});
