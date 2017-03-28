import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";

import { Tab, Tabs } from "react-toolbox";

import Source from "../../models/source";
import { dummySources } from "../../utils/test";
import IntegrationExpressJS from "./IntegrationExpressJS";
import IntegrationJava from "./IntegrationJava";
import IntegrationNodeJS from "./IntegrationNodeJSLambda";
import IntegrationPage from "./IntegrationPage";
import IntegrationSpokes from "./IntegrationSpokes";

const expect = chai.expect;

const source: Source = dummySources(1)[0];

describe("IntegrationPage", function () {

    describe("Rendering with key.", function () {
        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            wrapper = shallow(<IntegrationPage source={source} />);
        });

        it ("Tests there are the appropriate number of tabs.", function() {
            expect(wrapper.find(Tabs)).to.have.length(1);
            expect(wrapper.find(Tab)).to.have.length(4);
        });

        it ("Tests the Tabs property has the default index.", function() {
            expect(wrapper.find(Tabs).at(0).prop("index")).to.equal(0);
        });

        it ("Tests the first tab is IntegrationNodeJS and gets the secret key.", function() {
            const tab = wrapper.find(Tab).at(0);
            const tabPage = tab.find(IntegrationNodeJS); // TODO: I'm not sure why this doesn't work.
            // const tabPage = tab.childAt(0);
            expect(tabPage).to.have.length(1);
            expect(tabPage.prop("secretKey")).to.equal(source.secretKey);
        });

        it ("Tests the second tab is IntegrationExpressJS and gets the secret key.", function() {
            const tab = wrapper.find(Tab).at(1);
            const tabPage = tab.find(IntegrationExpressJS);
            expect(tabPage).to.have.length(1);
            expect(tabPage.prop("secretKey")).to.equal(source.secretKey);
        });

        it ("Tests the third tab is IntegrationJava and gets the secret key.", function() {
            const tab = wrapper.find(Tab).at(2);
            const tabPage = tab.find(IntegrationJava);
            expect(tabPage).to.have.length(1);
            expect(tabPage.prop("secretKey")).to.equal(source.secretKey);
        });

        it("Tests the Spoke Page exists", function() {
            const tab = wrapper.find(Tab).at(3);
            const tabPage = tab.find(IntegrationSpokes);
            expect(tabPage).to.have.length(1);
        });
    });

    describe("State", function () {
        let wrapper: ShallowWrapper<any, any>;

        beforeEach(function () {
            wrapper = shallow(<IntegrationPage source={source} />);
        });

        it ("Tests the tab gets the appropriate state after change.", function() {
            let tabs = wrapper.find(Tabs).at(0);
            tabs.simulate("change", 1);

            tabs = wrapper.find(Tabs).at(0);

            expect(tabs.prop("index")).to.equal(1);
        });
    });
});