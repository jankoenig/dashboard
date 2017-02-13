import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";

import { Grid } from "../../components/Grid";

import IntegrationJava from "./IntegrationJava";

const expect = chai.expect;

describe("IntegrationJava", function () {

    /**
     * These are extremely simple pages so we're just going to test that they render without error
     */
    describe("Rendering with secretKey.", function () {
        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            wrapper = shallow(<IntegrationJava secretKey={"ABC123"} />);
        });

        it("Tests the page renders.", function () {
            expect(wrapper.find(Grid)).to.have.length(1);
        });
    });

    /**
     * These are extremely simple pages so we're just going to test that they render without error
     */
    describe("Rendering without secretKey.", function () {
        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            wrapper = shallow(<IntegrationJava secretKey={undefined} />);
        });

        it("Tests the page renders.", function () {
            expect(wrapper.find(Grid)).to.have.length(1);
        });
    });
});