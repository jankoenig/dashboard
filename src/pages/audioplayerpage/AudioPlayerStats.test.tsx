import * as chai from "chai";
import { shallow } from "enzyme";
import * as moment from "moment";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";
import { dummySources } from "../../utils/test";

import DataTile from "../../components/DataTile";
import { AudioPlayerPage } from "./AudioPlayerPage";
import { AudioPlayerStats } from "./AudioPlayerStats";

chai.use(sinonChai);
chai.use(require("chai-datetime"));
let expect = chai.expect;

describe("Audio Player Stats", function () {
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
                <AudioPlayerStats source={undefined} startDate={undefined} endDate={undefined} />
            ));

            expect(wrapper.find(DataTile)).to.have.length(2);
        });

        it("Tests that the stats view is there.", function () {
            const wrapper = shallow((
                <AudioPlayerStats source={source.name} startDate={undefined} endDate={undefined} />
            ));

            expect(wrapper.find(DataTile)).to.have.length(2);
        });

        it("Tests that the audio stats has the appropriate props.", function () {
            const start = moment().subtract(7, "days");
            const end = moment();
            const wrapper = shallow((
                <AudioPlayerPage source={source} goHome={goHome} />
            ));
            const audioStats = wrapper.find(AudioPlayerStats);
            expect(audioStats).to.have.prop("source", source.name);

            // Can't use the convience of chai to check dates.
            const startProp = audioStats.prop("startDate") as moment.Moment;
            const endProp = audioStats.prop("endDate") as moment.Moment;
            expect(startProp.toDate()).to.equalDate(start.toDate());
            expect(endProp.toDate()).to.equalDate(end.toDate());
        });
    });
});
