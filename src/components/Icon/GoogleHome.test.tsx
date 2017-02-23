import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";

import { IconButton } from "react-toolbox/lib/button";

import GoogleHome from "./GoogleHome";

const expect = chai.expect;

const THEME = "TestTheme";
const STYLE = {
    height: 100,
    width: 200
};

describe("GoogleHome", function () {
    describe("Renders", function () {
        let wrapper: ShallowWrapper<any, any>;
        let onClick: Sinon.SinonStub;

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
            expect(wrapper.find(IconButton)).to.have.length(1);
        });

        it("Passes the style and theme to the button.", function () {
            const buttonWrapper = wrapper.find(IconButton).at(0);
            expect(buttonWrapper.prop("theme")).to.equal(THEME);
            expect(buttonWrapper.prop("style")).to.deep.equal(STYLE);
        });

        it("Uses the onclick properly.", function () {
            const buttonWrapper = wrapper.find(IconButton).at(0);
            buttonWrapper.simulate("click");
            expect(onClick).to.have.been.calledOnce;
        });
    });
});