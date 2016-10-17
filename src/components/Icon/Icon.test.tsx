import * as chai from "chai";
import { shallow } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable

import ICON from "./constants";
import Icon from "./Icon";

let expect = chai.expect;

describe("Icon", function() {
    it("renders correctly", function() {
        const wrapper = shallow(<Icon width={ 200 } height={ 200 } icon={ ICON.GITHUB } />);
        expect(wrapper.find("svg")).to.have.length(1);
    });
});