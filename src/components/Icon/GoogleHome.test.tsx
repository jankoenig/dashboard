import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";

import GoogleHome from "./GoogleHome";

const expect = chai.expect;

// This is the name of the class that gets created when wrapping a tooltip around another component.
const wrappedButton = "ThemedTooltippedComponent";

const THEME = "TestTheme";
const STYLE = {
    height: 100,
    width: 200
};

describe("GoogleHome", function () {
    describe("Renders", function () {
        let wrapper: ShallowWrapper<any, any>;
        let onClick: sinon.SinonStub;

        before(function () {
            onClick = sinon.stub();
            wrapper = shallow(<GoogleHome
                theme={THEME}
                style={STYLE}
                onClick={onClick} />);
        });

        afterEach(function () {
            onClick.reset();
        });

        it("Contains an Icon Button", function () {
            expect(wrapper.find(wrappedButton)).to.have.length(1);
        });

        it("Passes the style and theme to the button.", function () {
            const buttonWrapper = wrapper.find(wrappedButton).at(0);
            expect(buttonWrapper.prop("theme")).to.equal(THEME);
            expect(buttonWrapper.prop("style")).to.deep.equal(STYLE);
        });

        it("Uses the onclick properly.", function () {
            const buttonWrapper = wrapper.find(wrappedButton).at(0);
            buttonWrapper.simulate("click");
            expect(onClick).to.have.been.calledOnce;
        });
    });
});