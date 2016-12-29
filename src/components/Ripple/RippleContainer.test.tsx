import * as chai from "chai";
import { shallow } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable

import { RippleContainer, RippleContainerProps } from "./RippleContainer";

let expect = chai.expect;

describe("RippleContainer", function() {

    it ("Renders properly", function() {
        let wrapper = shallow(<RippleContainer/>);

        let div = wrapper.find("div");

        expect(div).to.have.length(1);

        let className = div.props().className;
        let style = div.props().style;

        expect(className).to.equal("mdl-js-ripple-effect");
        expect(style.position).to.equal("relative");
        expect(style.overflow).to.equal("hidden");
        expect(style.cursor).to.equal("pointer");
    });

    it ("Combines classes properly", function() {
        let wrapper = shallow(<RippleContainer className={"Class1 Class2"}/>);

        let div = wrapper.find("div");

        expect(div).to.have.length(1);

        let className = div.props().className;

        expect(className).to.equal("mdl-js-ripple-effect Class1 Class2");
    });

    it ("Combines styles properly", function() {
        let wrapper = shallow(<RippleContainer style={{borderLeft: "5px", left: "6px", right: "7px", bottom: "8px"}}/>);

        let div = wrapper.find("div");

        expect(div).to.have.length(1);

        let style = div.props().style;

        expect(style.position).to.equal("relative");
        expect(style.overflow).to.equal("hidden");
        expect(style.cursor).to.equal("pointer");
        expect(style.borderLeft).to.equal("5px");
        expect(style.left).to.equal("6px");
        expect(style.right).to.equal("7px");
        expect(style.bottom).to.equal("8px");
    });

    it ("Tests that the children are added", function() {
        let wrapper = shallow(<RippleContainer><span/><span/><span/></RippleContainer>);

        expect(wrapper.find("span")).to.have.length(3);
    });

    it ("Tests the styles are updated after new props", function() {
        let wrapper = shallow(<RippleContainer className={"Class3 Class4"} style={{borderLeft: "5px", left: "6px", right: "7px", bottom: "8px"}}/>);

        let newProps: RippleContainerProps = {
            className: "Class3 Class4",
            style: {top: "9px", borderBottom: "10px"}
        };

        wrapper.setProps(newProps);

        let div = wrapper.find("div");

        expect(div).to.have.length(1);

        let className = div.props().className;
        let style = div.props().style;

        expect(className).to.equal("mdl-js-ripple-effect Class3 Class4");
        expect(style.position).to.equal("relative");
        expect(style.overflow).to.equal("hidden");
        expect(style.cursor).to.equal("pointer");
        expect(style.borderLeft).to.be.undefined;
        expect(style.left).to.be.undefined;
        expect(style.right).to.be.undefined;
        expect(style.bottom).to.be.undefined;
    });
});