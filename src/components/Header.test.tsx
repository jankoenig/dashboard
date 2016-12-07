import * as chai from "chai";
import { shallow } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import Header from "./Header";

// Setup chai with sinon-chai
chai.use(sinonChai);
let expect = chai.expect;

describe("Header", function () {
    it("renders correctly", function () {
        const wrapper = shallow(<Header />);
        expect(wrapper.find("header")).to.have.length(1);
    });

    describe("with title", function () {
        it("renders correctly", function () {
            const wrapper = shallow(<Header titles={["title"]} />);
            expect(wrapper.find("span").text()).to.have.equal("title");
            expect(wrapper.find("Select")).to.have.length(0);
        });
    });

    describe("with multiple titles", function() {
        it("renders correctly", function() {
            const wrapper = shallow(<Header titles={["title1", "title2"]} />);
            expect(wrapper.find("span")).to.have.length(0);
            // There should be a munu which lists the titles.
            expect(wrapper.find("Select")).to.have.length(1);
        });

        it("tests that the titles are selectable", function() {
            const onHandled = sinon.spy();
            const wrapper = shallow(<Header titles={["title1", "title2", "title3", "title4"]} onTitleSelect={onHandled} />);
            let select = wrapper.find("Select");

            select.simulate("selected", "title1", 0);
            select.simulate("selected", "title2", 1);
            select.simulate("selected", "title3", 2);
            select.simulate("selected", "title4", 3);
            select.simulate("selected", "title5", 4);

            expect(onHandled).to.have.callCount(5);
            expect(onHandled).to.be.calledWithExactly("title1", 0);
            expect(onHandled).to.be.calledWithExactly("title2", 1);
            expect(onHandled).to.be.calledWithExactly("title3", 2);
            expect(onHandled).to.be.calledWithExactly("title4", 3);
            expect(onHandled).to.be.calledWithExactly("title5", 4);
        });

        it("tests the selectd index", function() {
            const onHandled = sinon.spy();
            const wrapper = shallow(<Header titles={["title1", "title2", "title3", "title4"]} onTitleSelect={onHandled} selectedIndex={2}/>);
            let select = wrapper.find("Select");

            expect((select.props() as any).defaultIndex).to.equal(2);
        });
    });
});