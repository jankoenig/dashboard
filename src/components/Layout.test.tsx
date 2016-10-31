import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable

import Drawer from "./Drawer";
import Layout from "./Layout";

let expect = chai.expect;

describe("Layout", function() {
    let wrapper: ShallowWrapper<any, any>;

    beforeEach(() => {
        wrapper = shallow(<Layout />);
    });

    it("should render correctly", function() {
        expect(wrapper.type()).to.equal("div");
    });

    it("should not be setup for a drawer", function() {
        expect(wrapper.props().className).to.not.contain("mdl-layout--fixed-drawer");
    });

    describe("with children", function() {
        beforeEach(() => {
            wrapper = shallow(
                <Layout>
                    <h2>Header</h2>
                    <Drawer title="Drawer"/>
                </Layout>);
        });
        it("should render the children", function() {
          expect(wrapper.type()).to.equal("div");
          expect(wrapper.props().children).to.have.length(2);
        });
    });

    describe("with drawer property", function() {
        beforeEach(() => {
            wrapper = shallow(
                <Layout drawer={true} />
            );
        });

        it("should include the class for a drawer", function() {
            expect(wrapper.type()).to.exist;
            expect(wrapper.props().className).to.contain("mdl-layout--fixed-drawer");
        });
    });
});
