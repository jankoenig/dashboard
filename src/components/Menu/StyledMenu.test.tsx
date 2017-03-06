import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import { IconMenu } from "react-toolbox/lib/menu";

import StyledMenu from "./StyledMenu";

describe("StyledMenu", function() {
    describe("when rendered", function() {
        const wrapper = shallow(<StyledMenu />);
        it("renders the IconMenu", function() {
            expect(wrapper.find(IconMenu)).to.have.length(1);
        });
    });
});