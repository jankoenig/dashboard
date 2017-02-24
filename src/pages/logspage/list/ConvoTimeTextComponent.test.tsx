import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as moment from "moment";
import * as React from "react";

import ConvoTimeTextComponent from "./ConvoTimeTextComponent";

const DEFAULT_FORMAT = "MMM Do, h:mm:ss a";

const expect = chai.expect;

const style = {
    width: "100",
    height: "200"
};

describe("ConvoTimeTextComponent", function() {

    describe("Renders", function() {

        let timestamp: Date;
        let testMoment: moment.Moment;
        let wrapper: ShallowWrapper<any, any>;

        before(function() {
            timestamp = new Date();
            testMoment = moment(timestamp);
            wrapper = shallow(<ConvoTimeTextComponent
                style={style}
                timestamp={timestamp}/>);
        });

        it("Checks the spans", function() {
            expect(wrapper.find("span")).to.have.length(2);
        });

        it("Checks the first span gets the style", function() {
            expect(wrapper.find("span").at(0)).to.have.prop("style", style);
        });

        it("Checks the formated time.", function() {
            // Since it's part of the same line is actaully combines the two.
            const text = testMoment.format(DEFAULT_FORMAT) + testMoment.fromNow();
            expect(wrapper.find("span").at(0)).to.have.text(text);
        });

        it("Checks the seconds one at text.", function() {
            expect(wrapper.find("span").at(1)).to.have.text(moment(timestamp).fromNow());
        });
    });
});