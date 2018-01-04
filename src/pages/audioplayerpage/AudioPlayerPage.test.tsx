import * as chai from "chai";
import { shallow } from "enzyme";
import * as moment from "moment";
import * as React from "react";
import DatePicker from "react-toolbox/lib/date_picker";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import { dummySources } from "../../utils/test";
import { AudioPlayerPage } from "./AudioPlayerPage";
import AudioSessionSummary from "./NumberSessions";

chai.use(sinonChai);
chai.use(require("chai-datetime"));
let expect = chai.expect;

describe("Audio Player Page", function () {
    let source = dummySources(1)[0];

    describe("Initial load", function () {
        let goHome: sinon.SinonStub;

        before(function () {
            goHome = sinon.stub();
        });

        afterEach(function () {
            goHome.reset();
        });

        after(function () {
        });

        it("Tests that nothing is displayed when source is not defined.", function () {
            const wrapper = shallow((
                <AudioPlayerPage source={undefined} goHome={goHome} />
            ));

            expect(wrapper.find(AudioSessionSummary)).to.have.length(0);
            expect(wrapper.find(AudioPlayerPage)).to.have.length(0);
        });

        it("Tests that the date picker view is there.", function () {
            const wrapper = shallow((
                <AudioPlayerPage source={source} goHome={goHome} />
            ));

            expect(wrapper.find(DatePicker)).to.have.length(2);
        });

        it("Tests that the summary view is there.", function () {
            const wrapper = shallow((
                <AudioPlayerPage source={source} goHome={goHome} />
            ));

            expect(wrapper.find(AudioSessionSummary)).to.have.length(1);
        });

        it("Tests that the summary view has the appropriate props.", function () {
            const start = moment().subtract(7, "days");
            const end = moment();
            const wrapper = shallow((
                <AudioPlayerPage source={source} goHome={goHome} />
            ));

            const summary = wrapper.find(AudioSessionSummary);
            expect(summary).to.have.prop("source", source.id);

            // Can't use the convience of chai to check dates.
            const startProp = summary.prop("startDate") as moment.Moment;
            const endProp = summary.prop("endDate") as moment.Moment;
            expect(startProp.toDate()).to.equalDate(start.toDate());
            expect(endProp.toDate()).to.equalDate(end.toDate());
        });
    });
});
