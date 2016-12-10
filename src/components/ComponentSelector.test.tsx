import * as chai from "chai";
import { shallow } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import { ComponentSelector, SelectableComponent } from "./ComponentSelector";
import { Select } from "./Select";

// Setup chai with sinon-chai
chai.use(sinonChai);
let expect = chai.expect;

let comp1: SelectableComponent = {
    title: "Title1",
    component: (<div className="comp1"/>)
};
let comp2: SelectableComponent = {
    title: "Title2",
    component: (<div className="comp2"><div/></div>)
};
let comp3: SelectableComponent = {
    title: "Title3",
    component: (<div className="comp3"><div/><div/></div>)
};
let comp4: SelectableComponent = {
    title: "Title4",
    component: (<div className="comp3"><div/><div/><div/></div>)
};
let comp5: SelectableComponent = {
    title: "Title5",
    component: (<div className="comp4"><div/><div/><div/><div/></div>)
};

let comps: SelectableComponent[] = [ comp1, comp2, comp3, comp4, comp5 ];

describe("ComponentSelector.tsx", function() {

    it("Renders correctly", function() {
        let wrapper = shallow(<ComponentSelector components={comps} onSelected={sinon.stub()} />);
        expect(wrapper.find(Select).length).to.equal(1);
        expect(wrapper.find(".sel-comp-container").length).to.equal(1);
    });

    describe("Tests the selection part.", function() {

        let onSelected: Sinon.SinonStub;

        before(function() {
            onSelected = sinon.stub();
        });

        afterEach(function() {
            onSelected.reset();
        });

        it("Tests the default component", function() {
            let wrapper = shallow(<ComponentSelector components={comps} onSelected={onSelected} />);
            let container = wrapper.find(".sel-comp-container").first();
            // expect(container.find(".comp1").length).to.equal(1);
            // I have no idea why enzyme won't find the classname ".comp1", but it won't.
            // Got tired of fighting it, so searching for the number of divs in the component.  It's stupid, I know.
            expect(container.find("div").length).to.equal(2); // The container and the element inside.
        });

        it("Tests the selection chooses the correct component", function() {
            let wrapper = shallow(<ComponentSelector components={comps} onSelected={onSelected} />);
            let selector = wrapper.find(Select).first();

            selector.simulate("selected", comp4, 3);

            let container = wrapper.find(".sel-comp-container").first();
            expect(container.find("div").length).to.equal(5);
        });

        it("Tests the callback is called on a change.", function() {
            let wrapper = shallow(<ComponentSelector components={comps} onSelected={onSelected} />);
            let selector = wrapper.find(Select).first();

            selector.simulate("selected", comp4, 3);

            expect(onSelected).to.be.calledOnce;
            expect(onSelected).to.be.calledWith(3, comp4);
        });
    });
});