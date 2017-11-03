import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as moment from "moment";
import * as React from "react";

import {Grid} from "../../components/Grid";
import Source from "../../models/source";
import { dummySources } from "../../utils/test";
import AudioPlayerSummary from "./SessionDuration";

const expect = chai.expect;

describe("AudioPlayerSummary", function () {

    let start: moment.Moment;
    let end: moment.Moment;
    let source: Source;

    before(function () {
        source = dummySources(1)[0];
        start = moment().subtract(10, "days");
        end = moment().subtract(2, "days");
    });

    describe("Render", function () {
        let wrapper: ShallowWrapper<any, any>;

        beforeEach(function () {
            wrapper = shallow((
                <AudioPlayerSummary
                    source={source.name}
                    startDate={start}
                    endDate={end} />
            ));
        });

        it("Tests the audio summary exists when no data is provided.", function () {
            expect(wrapper.find(Grid)).to.exist;
        });

    });
});
