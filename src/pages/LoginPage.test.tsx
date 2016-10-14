import { expect } from "chai";
import { shallow } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable
import { Provider } from "react-redux";

import LoginPage from "./LoginPage";

describe("LoginPage", () => {
    // TODO: This test needs some work
    it("should render correctly", function() {
        const wrapper = shallow(
            <Provider>
                <LoginPage />
            </Provider>);
        let loginPage = wrapper.find("LoginPage");

        expect(loginPage).to.exist;
    });
});
