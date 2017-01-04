import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import { AuthForm, LoginGithub, NormalLoginForm, PasswordReset } from "./AuthForm";

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

        it("Renders properly without callback.", function () {
            const wrapper = shallow((
                <LoginGithub />
            ));

            expect(wrapper.find("Themed")).to.have.length(0);
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

    describe("Normal Login Form", function () {

        const onEmailChange = sinon.spy();
        const onLogin = sinon.spy();
        const onResetPassword = sinon.spy();
        const onSignUpWithEmail = sinon.spy();

        let wrapper: ShallowWrapper<any, any>;

        beforeEach(function () {
            wrapper = shallow((
                <NormalLoginForm
                    error="Error"
                    onEmailChange={onEmailChange}
                    onLogin={onLogin}
                    onResetPassword={onResetPassword}
                    onSignUpWithEmail={onSignUpWithEmail} />
            ));
        });

        afterEach(function () {
            onEmailChange.reset();
            onLogin.reset();
            onResetPassword.reset();
            onSignUpWithEmail.reset();
        });

        it("Renders properly.", function () {
            expect(wrapper.find("LoginForms")).to.have.length(1);
            expect(wrapper.find("Themed")).to.have.length(2);
            expect(wrapper.find("PasswordReset")).to.have.length(1);

            let loginForm = wrapper.find("LoginForms").first();

            expect(loginForm.prop("error")).to.equal("Error");

            let loginBtn = wrapper.find("Themed").first();

            expect(loginBtn.prop("label")).to.equal("Login");

            let signUpBtn = wrapper.find("Themed").at(1);
            expect(signUpBtn.prop("label")).to.equal("Sign Up");
        });

        describe("With filled state.", function () {

            const state = {
                error: "New Error",
                email: "test@test.com",
                password: "1234ABC",
                confirmPassword: "ABC1234",
                isConfirmPassword: true
            };

            beforeEach(function () {
                wrapper.setState(state);
            });

            it("Renders properly with filled state.", function () {
                expect(wrapper.find("LoginForms")).to.have.length(1);
                expect(wrapper.find("Themed")).to.have.length(2);
                expect(wrapper.find("PasswordReset")).to.have.length(1);

                let loginForm = wrapper.find("LoginForms").first();

                expect(loginForm.prop("email")).to.equal("test@test.com");
                expect(loginForm.prop("password")).to.equal("1234ABC");
                expect(loginForm.prop("confirmPassword")).to.equal("ABC1234");
                expect(loginForm.prop("showConfirmPassword")).to.be.true;
                expect(loginForm.prop("error")).to.equal("New Error");

                let loginBtn = wrapper.find("Themed").first();

                expect(loginBtn.prop("label")).to.equal("Login");

                let signUpBtn = wrapper.find("Themed").at(1);
                expect(signUpBtn.prop("label")).to.equal("Submit");
            });

            it("Throws callback and state for onEmailChange.", function () {
                wrapper.find("LoginForms").simulate("emailChange", "newtest@test.com");
                expect(onEmailChange).to.be.calledOnce;
                expect(onEmailChange).to.be.calledWith("newtest@test.com");

                expect(wrapper.state("email")).to.equal("newtest@test.com");
            });

            it("Sets state on password change.", function () {
                wrapper.find("LoginForms").simulate("passwordChange", "new Password");

                expect(wrapper.state("password")).to.equal("new Password");
            });

            it("Sets state on confirm password change.", function () {
                wrapper.find("LoginForms").simulate("confirmPasswordChange", "New Confirmation Password");

                expect(wrapper.state("confirmPassword")).to.equal("New Confirmation Password");
            });

            it("Sets state on password submit with mismatched passwords.", function () {
                wrapper.find("LoginForms").simulate("passwordSubmit");
                // Showing form submit.
                expect(wrapper.state("error")).to.equal("Passwords do not match.");
                expect(wrapper.state("password")).to.equal("");
                expect(wrapper.state("confirmPassword")).to.equal("");
            });

            it("Throws callback and sets state on password submit with matching passwords.", function () {
                let newState = { ...state, ...{ confirmPassword: state.password } };
                wrapper.setState(newState);
                wrapper.find("LoginForms").simulate("passwordSubmit");
                // Showing form submit.
                expect(wrapper.state("error")).to.equal("");
                expect(wrapper.state("password")).to.equal("");
                expect(wrapper.state("confirmPassword")).to.equal("");
                expect(onSignUpWithEmail).to.have.been.calledOnce;
                expect(onSignUpWithEmail).to.have.been.calledWith(state.email, state.password);
            });

            it("Throws login and sets state when not showing confirm password.", function () {
                let newState = { ...state, ...{ confirmPassword: "", isConfirmPassword: false } };
                wrapper.setState(newState);
                wrapper.find("LoginForms").simulate("passwordSubmit");

                // Showing form submit.
                expect(wrapper.state("error")).to.equal("");
                expect(wrapper.state("password")).to.equal("");
                expect(wrapper.state("confirmPassword")).to.equal("");
                expect(onLogin).to.have.been.calledOnce;
                expect(onLogin).to.have.been.calledWith(state.email, state.password);
            });

            it ("Updates state on new props.", function () {
                wrapper.setProps({
                    error: "New Error"
                });

                expect(wrapper.state("error")).to.equal("New Error");
            });
        });
    });
});
