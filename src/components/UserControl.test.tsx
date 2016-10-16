import * as chai from "chai";
import { render } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import User from "../models/user";
import UserControl from "./UserControl";

// Setup chai with sinon-chai
chai.use(sinonChai);
let expect = chai.expect;

describe("UserControl", function() {
    describe("without user", function() {
        it("renders correctly", function() {
            const login = sinon.spy();
            const logout = sinon.spy();
            const wrapper = render(<UserControl login={login} logout={logout}/>);
            expect(wrapper.find("header")).to.have.length(1);
            expect(wrapper.find("p")).to.have.length(0);
            expect(wrapper.find("Button")).to.have.length(1);
            expect(wrapper.find("Button").text()).to.equal("Login");
        });
    });

    describe("with user", function() {
        it("renders correctly", function() {
            const login = sinon.spy();
            const logout = sinon.spy();
            const user = new User({email: "email"});
            const wrapper = render(<UserControl login={login} logout={logout} user={user}/>);
            expect(wrapper.find("header")).to.have.length(1);
            expect(wrapper.find("p")).to.have.length(1);
            expect(wrapper.find("Button")).to.have.length(1);
            expect(wrapper.find("Button").text()).to.equal("Logout");
        });
    });
});
