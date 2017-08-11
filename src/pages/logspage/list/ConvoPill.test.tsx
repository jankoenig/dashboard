import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";

import Pill from "../../../components/Pill";
import ConvoPill from "./ConvoPill";

const expect = chai.expect;

describe("ConvoPill", function () {
    describe("Render", function () {
        let wrapper: ShallowWrapper<any, any>;

        describe("Visible", function () {
            before(function () {
                wrapper = shallow(<ConvoPill show={true} text={"Test"} />);
            });

            it("Tests that the pill is visible", function () {
                expect(wrapper.find(Pill)).to.have.length(1);
            });

            it("Tests the pill has the text.", function () {
                expect(wrapper.find(Pill).at(0)).to.have.text("<Pill />");
            });
        });

        describe("Invisible", function () {
            before(function () {
                wrapper = shallow(<ConvoPill show={false} text={"Test"} />);
            });

            it("Tests that the pill is invisible", function() {
                expect(wrapper.find(Pill)).to.have.length(0);
            });
        });
    });
});
