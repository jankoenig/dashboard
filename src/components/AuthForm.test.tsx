import * as chai from "chai";
import { shallow } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import { AuthForm, LoginGithub, PasswordReset } from "./AuthForm";

// Setup chai with sinon-chai
chai.use(sinonChai);
let expect = chai.expect;

describe("AuthForm", function () {
    it("renders the basics", function () {
        const onSubmit = sinon.spy();
        const wrapper = shallow(<AuthForm onSubmit={onSubmit} />);
        // A form, two inputs and a button
        expect(wrapper.find("NormalLoginForm")).to.have.length(1);
        expect(wrapper.find("LoginGithub")).to.have.length(1);
    });

    it("Tests top level callback for submit", function () {
        const onSubmit = sinon.spy();
        const wrapper = shallow(<AuthForm onSubmit={onSubmit} />);

        wrapper.find("NormalLoginForm").first().simulate("login");
        expect(onSubmit).to.have.been.calledOnce;
    });

    it("Tests top level callback for sign up with email", function () {
        const onSignUpWithEmail = sinon.spy();
        const onSubmit = sinon.spy();
        const wrapper = shallow((
            <AuthForm onSubmit={onSubmit}
                onSignUpWithEmail={onSignUpWithEmail} />
        ));

        wrapper.find("NormalLoginForm").simulate("SignUpWithEmail");
        expect(onSignUpWithEmail).to.have.been.calledOnce;
    });

    it("Tests top level callback for login with github", function () {
        const onSubmit = sinon.spy();
        const onLoginWithGithub = sinon.spy();
        const wrapper = shallow((
            <AuthForm
                onSubmit={onSubmit}
                onLoginWithGithub={onLoginWithGithub} />
        ));

        wrapper.find("LoginGithub").simulate("loginWithGithub");
        expect(onLoginWithGithub).to.have.been.calledOnce;
    });

    it("Top level callback for reset password.", function () {
        const onSubmit = sinon.spy();
        const onResetPassword = sinon.spy();
        const wrapper = shallow((
            <AuthForm
                onSubmit={onSubmit}
                onResetPassword={onResetPassword} />
        ));

        wrapper.find("NormalLoginForm").simulate("resetPassword");
        expect(onResetPassword).to.have.been.calledOnce;
    });

    describe("Password Reset Button", function () {

        it("Renders", function () {
            const onPasswordReset = sinon.spy();

            const wrapper = shallow((
                <PasswordReset
                    onPasswordReset={onPasswordReset} />
            ));

            // The "Button" class compiles down to a "Themed" class because it's heavily styled.
            expect(wrapper.find("Themed")).to.have.length(1);
        });

        it("Tests the callback is thrown on click.", function () {
            const onPasswordReset = sinon.spy();

            const wrapper = shallow((
                <PasswordReset
                    onPasswordReset={onPasswordReset} />
            ));

            // The "Button" class compiles down to a "Themed" class because it's heavily styled.
            wrapper.find("Themed").first().simulate("click");
            expect(onPasswordReset).to.have.been.calledOnce;
        });
    });

    describe("Login Github button", function () {

        it("Renders properly,", function () {
            const onLoginWithGithub = sinon.spy();
            const wrapper = shallow((
                <LoginGithub
                    onLoginWithGithub={onLoginWithGithub} />
            ));

            // The "Button" class compiles down to a "Themed" class because it's heavily styled.
            expect(wrapper.find("Themed")).to.have.length(1);
        });

        it("Tests the clalback is thrown on click.", function () {
            const onLoginWithGithub = sinon.spy();
            const wrapper = shallow((
                <LoginGithub
                    onLoginWithGithub={onLoginWithGithub} />
            ));

            // The "Button" class compiles down to a "Themed" class because it's heavily styled.
            wrapper.find("Themed").simulate("click");
            expect(onLoginWithGithub).to.have.been.calledOnce;
        });
    });
});
