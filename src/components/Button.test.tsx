import * as chai from "chai";
import { render, shallow } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import Button from "./Button";

// Setup chai with sinon-chai
chai.use(sinonChai);
let expect = chai.expect;

describe("Button Component", function() {
  it("should create a button with a default type and classes", () => {
    const wrapper = shallow(<Button>OK</Button>);
    const button = wrapper.find("button");

    expect(button.length).to.equal(1);
    expect(button.text()).to.equal("OK");
    expect(button.type()).to.equal("button");
    expect(button.hasClass("mdl-button")).to.equal(true);
  });

  it("should allow for a custom css class in addition to the default", () => {
    const wrapper = render(<Button className="bg-green">OK</Button>);
    const button = wrapper.find("button");

    expect(button.hasClass("bg-green")).to.equal(true);
    expect(button.hasClass("mdl-button")).to.equal(true);
  });

  it("should create a submit button", function() {
    const wrapper = shallow(<Button type="submit">Submit</Button>);
    const button = wrapper.find("button");

    expect(button.prop("type")).to.equal("submit");
  });

  it("should respond to click events", function() {
    const onButtonClick = sinon.spy();

    const wrapper = shallow(<Button onClick={onButtonClick} />);

    wrapper.simulate("click");

    expect(onButtonClick).to.have.been.called;
    expect(onButtonClick).to.have.been.calledOnce;
  });
  it("should return a link if an href is passed", function() {
        const wrapper = shallow(<Button href="https://bespoken.tools">OK</Button>);

        expect(wrapper.find("button")).to.have.length(0);
        expect(wrapper.find("a")).to.have.length(1);
        let a = wrapper.find("a");
        expect(a.props().href).to.equal("https://bespoken.tools");
        expect(a.props().target).to.equal("_blank");
  });
});
