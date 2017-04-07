import * as chai from "chai";
import * as chaiEnzyme from "chai-enzyme";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";

import * as BubbleTypes from "./Bubbles";
import Bubble from "./SpeechBubble";

chai.use(chaiEnzyme);
const expect = chai.expect;

describe("SpeechBubble", function () {

    let wrapper: ShallowWrapper<any, any>;

    before(function () {
        wrapper = shallow(<Bubble text="Test Bubble" cite="Test Cite" />);
    });

    it("Tests that the speech bubble renders text.", function () {
        const textWrapper = wrapper.find("p").at(0);
        expect(textWrapper).to.have.text("Test Bubble");
    });

    it("Tests that the speech bubble renders the cited text.", function () {
        const textWrapper = wrapper.find("cite").at(0);
        expect(textWrapper).to.have.text("Test Cite");
    });

    it("Tests that the speech bubble does not render a cite element if cite is not present.", function () {
        let newWrapper = shallow(<Bubble text="TestBubble" />);
        expect(newWrapper.find("cite")).to.have.length(0);
    });

    describe("Styles", function () {
        it("Tests the default style.", function () {
            const expectedStyle = BubbleTypes.getType(undefined);
            let wrapper = shallow(<Bubble text="Text Text" />);
            const bubbleElements = wrapper.find("div");
            checkStyles(bubbleElements, expectedStyle);
        });

        it("Tests the isosceles style.", function() {
            const expectedStyle = BubbleTypes.getType("isosceles");
            let wrapper = shallow(<Bubble text="Text Text" style="isosceles" />);
            const bubbleElements = wrapper.find("div");
            checkStyles(bubbleElements, expectedStyle);
        });

        it("Tests the obtuse style.", function() {
            const expectedStyle = BubbleTypes.getType("obtuse");
            let wrapper = shallow(<Bubble text="Text Text" style="obtuse" />);
            const bubbleElements = wrapper.find("div");
            checkStyles(bubbleElements, expectedStyle);
        });

        it("Tests the border style.", function() {
            const expectedStyle = BubbleTypes.getType("border");
            let wrapper = shallow(<Bubble text="Text Text" style="border" />);
            const bubbleElements = wrapper.find("div");
            checkStyles(bubbleElements, expectedStyle);
        });

        function checkStyles(bubbleElements: ShallowWrapper<any, any>, expectedStyle: any) {
            expect(bubbleElements.at(0).prop("style")).to.deep.equal(expectedStyle.containerStyle);
            expect(bubbleElements.at(1).prop("style")).to.deep.equal(expectedStyle.quoteStyle);
            expect(bubbleElements.at(2).prop("style")).to.deep.equal(expectedStyle.trianglePosition);
            expect(bubbleElements.at(4).prop("style")).to.deep.equal(expectedStyle.beforeTriangleStyle);
            expect(bubbleElements.at(5).prop("style")).to.deep.equal(expectedStyle.afterTriangleStyle);
        }
    });
});