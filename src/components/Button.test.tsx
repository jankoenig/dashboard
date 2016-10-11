import { shallow, render } from "enzyme";
import { expect } from "chai";

// tslint:disable:no-unused-variable
import * as React from 'react'; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable

import Button from "./Button";

describe('Button Component', () => {
  it('should create a button with a default type and classes', () => {
    const wrapper = shallow(<Button>OK</Button>);
    const button = wrapper.find('button');

    expect(button.length).to.equal(1);
    expect(button.text()).to.equal('OK');
    expect(button.prop('type')).to.equal('button');
    expect(button.hasClass('mdl-button')).to.equal(true);
  });

  it('should allow for a custom css class in addition to the default', () => {
    const wrapper = render(<Button className="bg-green">OK</Button>);
    const button = wrapper.find('button');

    expect(button.hasClass('bg-green')).to.equal(true);
    expect(button.hasClass('mdl-button')).to.equal(true);
  });

  it('should create a submit button', () => {
    const wrapper = shallow(<Button type="submit">Submit</Button>);
    const button = wrapper.find('button');

    expect(button.prop('type')).to.equal('submit');
  });

  /*
  it('should respond to click events', () => {
    const onButtonClick = jasmine.createSpy('onButtonClick');

    const wrapper = shallow(<Button onClick={onButtonClick} />);

    wrapper.simulate('click');

    expect(onButtonClick).toHaveBeenCalled();
    expect(onButtonClick.calls.count()).toBe(1);
  }); */

});
