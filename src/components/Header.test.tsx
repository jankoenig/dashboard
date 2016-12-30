import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import Dropdown from "react-toolbox/lib/dropdown";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import { Header, HeaderProps, HeaderState } from "./Header";

// Setup chai with sinon-chai
chai.use(sinonChai);
let expect = chai.expect;

describe("Header", function () {
    describe("without any properties", function () {

        const wrapper = shallow(<Header />);
        it("renders the main header div", function () {
            expect(wrapper.find("header")).to.have.length(1);
        });
        it("does not render the home Link", function () {
            expect(wrapper.find("Link")).to.have.length(0);
        });
        it("renders the menu", function () {
            expect(wrapper.find("StyledMenu")).to.have.length(1);
        });
    });

    describe("with displayHomeButton true", function () {
        const wrapper = shallow(<Header displayHomeButton={true} />);
        it("displays a Link to home", function () {
            expect(wrapper.find("Link")).to.have.length(1);
        });
    });

    describe("with one source", function () {
        const wrapper = shallow(<Header sources={[{ label: "name", value: "id" }]} />);

        it("renders the label span", function () {
            expect(wrapper.find("span")).to.have.length(1);
            expect(wrapper.find("span").text()).to.have.equal("name");
        });
        it("does not render the Dropdown", function () {
            expect(wrapper.find(Dropdown)).to.have.length(0);
        });
    });

    describe("with multiple sources", function () {
        let wrapper: ShallowWrapper<HeaderProps, HeaderState>;
        const componentWillReceivePropsSpy = sinon.spy(Header.prototype, "componentWillReceiveProps");
        const setStateSpy = sinon.spy(Header.prototype, "setState");
        const onSourceSelectedSpy = sinon.spy();

        beforeEach(function () {
            wrapper = shallow((
                <Header
                    onSourceSelected={onSourceSelectedSpy}
                    sources={[{ label: "name", value: "id" }, { label: "name1", value: "id1" }, { label: "name2", value: "id2" }, { label: "name3", value: "id3" }]}
                    />
            ));
        });

        afterEach(function () {
            componentWillReceivePropsSpy.reset();
            setStateSpy.reset();
        });

        it("does not render the label span", function () {
            expect(wrapper.find("span")).to.have.length(0);
        });
        it("renders the dropdown", function () {
            expect(wrapper.find(Dropdown)).to.have.length(1);
        });
        it("updates the selectedSourceId on receiving props", function () {
            wrapper.setProps({ currentSourceId: "id" });
            expect(componentWillReceivePropsSpy).to.have.been.calledOnce;
            expect(wrapper.state().selectedSourceId).to.equal("id");
            expect(setStateSpy).to.have.been.calledOnce;
            expect(setStateSpy).to.have.been.calledWith({ selectedSourceId: "id" });
        });
        it("calls the onSourceSelected prop", function() {
            // need to go untyped here so we can call the method on the component
            let instance =  wrapper.instance() as any;
            instance.handleItemSelect("id");

            expect(onSourceSelectedSpy).to.have.been.calledOnce;
            expect(onSourceSelectedSpy).to.have.been.calledWith({ label: "name", value: "id" });
        });
    });
});