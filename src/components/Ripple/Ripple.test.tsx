import * as chai from "chai";
import { shallow } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable

import Ripple from "./Ripple";

let expect = chai.expect;

describe("Ripple", function() {

    it ("Renders properly", function() {
        let wrapper = shallow(<Ripple/>);

        let span = wrapper.find("span");

        expect(span).to.have.length(1);

        let className = span.props().className;

        expect(className).to.equal("mdl-ripple");
    });

    it ("Combines classes properly", function() {
        let wrapper = shallow(<Ripple className={"Class1 Class2"}/>);

        let span = wrapper.find("span");

        expect(span).to.have.length(1);

        let className = span.props().className;

        expect(className).to.equal("mdl-ripple Class1 Class2");
    });
});