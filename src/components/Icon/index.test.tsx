import * as chai from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import { Icon, ICON } from "./index";

let expect = chai.expect;

describe("Icon", function () {
    it("renders correctly", function () {
        const wrapper = shallow(<Icon width={200} height={200} icon={ICON.GITHUB} />);
        expect(wrapper.find("svg")).to.have.length(1);
    });
});

describe("ICON", function () {
    describe("GITHUB", function () {
        it("exists", function () {
            expect(ICON.GITHUB.path).to.not.be.null;
        });
    });
    describe("DEFAULT_AVATAR", function () {
        it("exists", function () {
            expect(ICON.DEFAULT_AVATAR.path).to.not.be.null;
        });
    });
});

