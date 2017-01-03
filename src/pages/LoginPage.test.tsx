import * as chai from "chai";
import { shallow } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import { LoginPage } from "./LoginPage";

// Setup chai with sinon-chai
chai.use(sinonChai);
let expect = chai.expect;

describe("LoginPage", () => {
    it("should render an AuthForm", function () {
        const login = sinon.spy();
        const loginWithGithub = sinon.spy();
        const signUpWithEmail = sinon.spy();
        const resetPassword = sinon.spy();
        const wrapper = shallow((
            <LoginPage
                login={login}
                loginWithGithub={loginWithGithub}
                signUpWithEmail ={signUpWithEmail}
                resetPassword = {resetPassword}/>
        ));
        // It contains the AuthForm
        expect(wrapper.find("AuthForm")).to.have.length(1);
        expect(wrapper.find("AuthForm").first().prop("email")).to.equal("email");
    });
});
