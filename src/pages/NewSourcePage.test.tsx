import * as chai from "chai";
import { shallow } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import { NewSourcePage } from "./NewSourcePage";

// Setup chai with sinon-chai
chai.use(sinonChai);
let expect = chai.expect;

describe("New Source Page", function () {
    it("should render correctly", function () {
        const createSource = sinon.spy();
        const wrapper = shallow(
            <NewSourcePage
                createSource={createSource}
                error={undefined}
                newSource={undefined}
                sourceRequest={false}
                sources = {[]}/>
        );
        expect(wrapper.find("SourceForm")).to.have.length(1);
    });
});