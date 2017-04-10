import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import { IconButton } from "react-toolbox/lib/button";
import Dropdown from "react-toolbox/lib/dropdown";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import { Header, HeaderButton, HeaderProps, HeaderState, Home, PageButton, PageSwap, Title } from "./Header";

// Setup chai with sinon-chai
chai.use(sinonChai);
let expect = chai.expect;

describe("Header", function () {
    describe("without any properties", function () {

        const wrapper = shallow(<Header />);

        it("renders the main header div", function () {
            expect(wrapper.find("header")).to.have.length(1);
        });

        it("Renders the home Link", function () {
            expect(wrapper.find(Home)).to.have.length(1);
        });

        it("Renders the page swapper", function () {
            expect(wrapper.find(PageSwap)).to.have.length(1);
        });

        it("renders the menu", function () {
            expect(wrapper.find("StyledMenu")).to.have.length(1);
        });
    });

    describe("DisplayHome property", function () {

        it("displays a Link to home", function () {
            const wrapper = shallow(<Header displayHomeButton={true} />);
            const homeWrapper = wrapper.find(Home);
            expect(homeWrapper).to.have.length(1);
            expect(homeWrapper.prop("showHome")).to.be.true;
        });

        describe("Home button", function () {

            let handleHomeClick: Sinon.SinonStub;

            before(function () {
                handleHomeClick = sinon.stub();
            });

            beforeEach(function () {
                handleHomeClick.reset();
            });

            it("Displays the button when props say true.", function () {
                const wrapper = shallow(<Home handleHomeClick={handleHomeClick} showHome={true} />);
                expect(wrapper.find(IconButton)).to.have.length(1);
            });

            it("Displays the button when props say true.", function () {
                const wrapper = shallow(<Home handleHomeClick={handleHomeClick} showHome={false} />);
                expect(wrapper.find(IconButton)).to.have.length(0);
            });

            it("Calls the callback when clicked.", function () {
                const wrapper = shallow(<Home handleHomeClick={handleHomeClick} showHome={true} />);
                const iconButton = wrapper.find(IconButton).at(0);
                iconButton.simulate("click");
                expect(handleHomeClick).to.have.been.calledOnce;
            });
        });
    });

    describe("with one source", function () {
        const sources = [{ label: "name", value: "id" }];
        const wrapper = shallow(<Header sources={[{ label: "name", value: "id" }]} />);

        it("renders the title", function () {
            const titleWrapper = wrapper.find(Title);
            expect(titleWrapper).to.have.length(1);
            expect(titleWrapper.prop("sources")).to.deep.equal(sources);
        });

        describe("Title", function () {

            let handleItemSelect: Sinon.SinonStub;

            before(function () {
                handleItemSelect = sinon.stub();
            });

            beforeEach(function () {
                handleItemSelect.reset();
            });

            it("Renders the span with only one source.", function () {
                const wrapper = shallow(<Title handleItemSelect={handleItemSelect} selectedSourceId={""} sources={sources} />);
                expect(wrapper.find("span")).to.have.length(1);
                expect(wrapper.find("span").text()).to.have.equal("name");
            });
        });
    });

    describe("with multiple sources", function () {
        let wrapper: ShallowWrapper<HeaderProps, HeaderState>;
        const componentWillReceivePropsSpy = sinon.spy(Header.prototype, "componentWillReceiveProps");
        const setStateSpy = sinon.spy(Header.prototype, "setState");
        const onSourceSelectedSpy = sinon.spy();
        const sources = [{ label: "name", value: "id" }, { label: "name1", value: "id1" }, { label: "name2", value: "id2" }, { label: "name3", value: "id3" }];

        beforeEach(function () {
            wrapper = shallow((
                <Header
                    onSourceSelected={onSourceSelectedSpy}
                    sources={sources}
                />
            ));
        });

        afterEach(function () {
            componentWillReceivePropsSpy.reset();
            setStateSpy.reset();
        });

        it("renders the title", function () {
            const titleWrapper = wrapper.find(Title);
            expect(titleWrapper).to.have.length(1);
            expect(titleWrapper.prop("sources")).to.equal(sources);
        });

        it("updates the selectedSourceId on receiving props", function () {
            wrapper.setProps({ currentSourceId: "id" });
            expect(componentWillReceivePropsSpy).to.have.been.calledOnce;
            expect(wrapper.state().selectedSourceId).to.equal("id");
            expect(setStateSpy).to.have.been.calledOnce;
            expect(setStateSpy).to.have.been.calledWith({ selectedSourceId: "id" });

            const titleWrapper = wrapper.find(Title);
            expect(titleWrapper.prop("selectedSourceId")).to.equal("id");
        });

        it("calls the onSourceSelected prop", function () {
            // need to go untyped here so we can call the method on the component
            let instance = wrapper.instance() as any;
            instance.handleItemSelect("id");

            expect(onSourceSelectedSpy).to.have.been.calledOnce;
            expect(onSourceSelectedSpy).to.have.been.calledWith({ label: "name", value: "id" });
        });

        describe("Title", function () {

            let handleItemSelect: Sinon.SinonStub;
            let wrapper: ShallowWrapper<any, any>;

            before(function () {
                handleItemSelect = sinon.stub();
                wrapper = shallow((
                    <Title
                        sources={sources}
                        handleItemSelect={handleItemSelect}
                        selectedSourceId={"id"} />
                ));
            });

            beforeEach(function () {
                handleItemSelect.reset();
            });

            it("Tests the title renders the Dropdown.", function () {
                const dropdownWrapper = wrapper.find(Dropdown);
                expect(dropdownWrapper).to.have.length(1);
                expect(dropdownWrapper.prop("source")).to.deep.equal(sources);
                expect(dropdownWrapper.prop("value")).to.equal("id");
            });

            it("Tests the handle Item callback is returned on dropdown select.", function () {
                const dropdownWrapper = wrapper.find(Dropdown);
                dropdownWrapper.simulate("change", "id2");
                expect(handleItemSelect).to.have.been.calledOnce;
                expect(handleItemSelect).to.be.calledWith("id2");
            });
        });
    });

    describe("Page swapper", function () {
        const pages: PageButton[] = [{ icon: "home", name: "heeyyooo" }, { icon: "away", name: "fancy" }];

        let onPageSelected: Sinon.SinonStub;

        before(function () {
            onPageSelected = sinon.stub();
        });

        beforeEach(function () {
            onPageSelected.reset();
        });

        it("Tests the header passes the appropriate props to the page swap", function () {
            const wrapper = shallow(<Header pageButtons={pages} onPageSelected={onPageSelected} />);
            const pageswap = wrapper.find(PageSwap);
            expect(pageswap.prop("pageButtons")).to.deep.equal(pages);
            expect(pageswap.prop("onPageSelected")).to.equal(onPageSelected);
        });

        describe("PageSwap", function () {
            let wrapper: ShallowWrapper<any, any>;

            beforeEach(function() {
                wrapper = shallow(<PageSwap pageButtons={pages} onPageSelected={onPageSelected} />);
            });

            it("Tests the buttons are rendered properly.", function() {
                expect(wrapper.find(HeaderButton)).to.have.length(pages.length);
            });

            it ("Tests the callback", function() {
                const buttons = wrapper.find(HeaderButton).at(0);
                buttons.simulate("click", pages[0]);
                expect(onPageSelected).to.have.been.calledOnce;
                expect(onPageSelected).to.have.been.calledWith(pages[0]);
            });
        });
    });
});