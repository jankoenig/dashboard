import * as chai from "chai";
import { shallow } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import AuthForm from "./AuthForm";

// Setup chai with sinon-chai
chai.use(sinonChai);
let expect = chai.expect;

describe("AuthForm", function () {
    it("renders the basics", function () {
        const onSubmit = sinon.spy();
        const wrapper = shallow(<AuthForm onSubmit={onSubmit} />);
        // A form, two inputs and a button
        expect(wrapper.find("form")).to.have.length(1);
        expect(wrapper.find("input")).to.have.length(3);
        expect(wrapper.find("button")).to.have.length(2);
    });
    it("can be sumitted", function () {
        const onSubmit = sinon.spy();
        const wrapper = shallow(<AuthForm onSubmit={onSubmit} />);

       wrapper.find("button").first().simulate("click");
        expect(onSubmit).to.have.been.called;
    });
    it("can be logged in with Github", function () {
        const onSubmit = sinon.spy();
        const onLoginWithGithub = sinon.spy();
        const wrapper = shallow(
            <AuthForm
                onSubmit={onSubmit}
                onLoginWithGithub={onLoginWithGithub} />
        );

        wrapper.find("button").last().simulate("click");
        expect(onLoginWithGithub).to.have.been.called;
        expect(onSubmit).to.have.not.been.called;
    });
});
