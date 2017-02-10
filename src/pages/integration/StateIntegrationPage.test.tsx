import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";

import Source from "../../models/source";
import IntegrationPage from "./IntegrationPage";
import { StateIntegrationPage } from "./StateIntegrationPage";

const expect = chai.expect;

describe("StateIntegrationPage", function () {

    describe("Rendering with Source.", function () {
        let wrapper: ShallowWrapper<any, any>;
        let source: Source;

        before(function () {
            source = new Source({
                name: "Test Source",
                secretKey: "ABC123"
            });
            wrapper = shallow(<StateIntegrationPage source={source} />);
        });

        it("Tests the IntegrationPage is included..", function () {
            expect(wrapper.find(IntegrationPage)).to.have.length(1);
        });

        it("Tests the IntegrationPage contains the appropriate props.", function () {
            const page = wrapper.find(IntegrationPage).at(0);
            expect(page.prop("secretKey")).to.equal("ABC123");
        });

        it ("Tests it renders properly on props change to undefined.", function() {
            wrapper.setProps({ source: undefined });
            const page = wrapper.find(IntegrationPage).at(0);
            expect(page.prop("secretKey")).to.be.undefined;
        });

        it ("Tests it renders properly on props change to a new source.", function() {
            const newsource = new Source({
                name: "Testier Source",
                secretKey: "123ABC"
            });

            wrapper.setProps({ source: newsource });

            const page = wrapper.find(IntegrationPage).at(0);
            expect(page.prop("secretKey")).to.be.equal("123ABC");
        });
    });

    describe("Rendering without Source.", function () {
        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            wrapper = shallow(<StateIntegrationPage source={undefined} />);
        });

        it("Tests the IntegrationPage contains the appropriate props.", function () {
            const page = wrapper.find(IntegrationPage).at(0);
            expect(page.prop("secretKey")).to.be.undefined;
        });

        it ("Tests it renders properly on props change to a new source.", function() {
            const newsource = new Source({
                name: "Testier Source",
                secretKey: "123ABC"
            });

            wrapper.setProps({ source: newsource });

            const page = wrapper.find(IntegrationPage).at(0);
            expect(page.prop("secretKey")).to.be.equal("123ABC");
        });
    });
});