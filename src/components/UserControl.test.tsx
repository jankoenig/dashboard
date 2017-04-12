import * as chai from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import User from "../models/user";
import UserControl from "./UserControl";

// Setup chai with sinon-chai
chai.use(sinonChai);
let expect = chai.expect;

describe("UserControl", function () {
    describe("without user", function () {
        it("renders correctly", function () {
            const login = sinon.spy();
            const logout = sinon.spy();
            const wrapper = shallow(<UserControl login={login} logout={logout} />);

            let styledMenu = wrapper.find("StyledMenu");

            expect(styledMenu).to.have.length(1);

            let iconProps = styledMenu.prop("icon");

            // It returns JSX for "Icon" which compiles to a "function" which returns the actual item.
            // It being a function means it's correct.
            expect((iconProps as any).type).to.be.a("function");
        });
    });

    describe("with user", function () {
        describe("with photo", function () {
            it("renders correctly", function () {
                const login = sinon.spy();
                const logout = sinon.spy();
                const user = new User({ email: "email", photoUrl: "http://data.whicdn.com/images/60302035/original.jpg" });
                const wrapper = shallow(<UserControl login={login} logout={logout} user={user} />);

                let styledMenu = wrapper.find("StyledMenu");

                expect(styledMenu).to.have.length(1);

                let iconProps = styledMenu.prop("icon");

                // Enzyme doesn't see it as a "type" so comparing it as a "string".  It's correct if the type is "img".
                expect((iconProps as any).type).to.be.equal("img");
            });
        });
        describe("without photo", function () {
            it("renders correctly", function () {
                const login = sinon.spy();
                const logout = sinon.spy();
                const user = new User({ email: "email" });
                const wrapper = shallow(<UserControl login={login} logout={logout} user={user} />);

                let styledMenu = wrapper.find("StyledMenu");

                expect(styledMenu).to.have.length(1);

                let iconProps = styledMenu.prop("icon");

                expect((iconProps as any).type).to.be.a("function");
            });
        });

    });
});
