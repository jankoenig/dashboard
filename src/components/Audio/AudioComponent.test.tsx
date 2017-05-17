import * as chai from "chai";
import {shallow, ShallowWrapper} from "enzyme";
import * as React from "react";

import {audioTestUrl} from "../../utils/test";
import AudioComponent from "./AudioComponent";

const expect = chai.expect;

describe("AudioComponent", function () {

  it("renders properly", function () {
    const wrapper: ShallowWrapper<any, any> = shallow(<AudioComponent src={audioTestUrl} />);
    expect(wrapper.find("div")).to.have.length(1);
    expect(wrapper.find("audio")).to.have.length(1);
    expect(wrapper.find("source")).to.have.length(1);
  });
});
