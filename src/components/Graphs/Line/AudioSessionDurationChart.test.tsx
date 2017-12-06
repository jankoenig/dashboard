import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as moment from "moment";
import * as React from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import AudioSessionChart, { AudioSessionData } from "./AudioSessionDurationChart";

const expect = chai.expect;

const DATA_LENGTH = 10;

const data: AudioSessionData = {audioSessions: []};

describe("AudioSessionChart", function () {

    before(function () {
        let newData: any = {audioSessions: [], averageSessionDuration: 1000, sessionsAmount: DATA_LENGTH};
        for (let i = 0; i < DATA_LENGTH; ++i) {
            const newSessionsData: any = {};
            newSessionsData["sourceId"] = "source" + i;
            newSessionsData["duration"] = 1000;
            newSessionsData["sessionStartTime"] = moment().diff(i, "minutes");
            newData.audioSessions.push(newSessionsData);
        }
    });

    it("renders properly", function () {
        const wrapper: ShallowWrapper<any, any> = shallow(<AudioSessionChart data={data} />);
        expect(wrapper.find(ResponsiveContainer)).to.have.length(1);

        const responsiveContainer: ShallowWrapper<any, any> = wrapper.childAt(0);
        expect(responsiveContainer.find(Line)).to.have.length(1);
        expect(responsiveContainer.find(Tooltip)).to.have.length(1);
        expect(responsiveContainer.find(LineChart)).to.have.length(1);
        expect(responsiveContainer.find(XAxis)).to.have.length(1);
        expect(responsiveContainer.find(YAxis)).to.have.length(1);
    });

    describe("Props test", function () {
        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            wrapper = shallow(<AudioSessionChart data={data} />);
        });

        it("Tests that the data sent in props makes it to it's final destination.", function () {
            expect(wrapper.find(LineChart).prop("data")).to.equal(data.audioSessions);
        });
    });

    describe("Lines tests", function () {
        let wrapper: ShallowWrapper<any, any>;
        let linesWrapper: ShallowWrapper<any, any>;

        let newData: any = {audioSessions: [], averageSessionDuration: 1000, sessionsAmount: DATA_LENGTH};

        before(function () {
            for (let i = 0; i < DATA_LENGTH; ++i) {
                const newSessionsData: any = {};
                newSessionsData["sourceId"] = "source" + i;
                newSessionsData["duration"] = 1000;
                newSessionsData["sessionStartTime"] = moment().diff(i, "minutes");
                newData.audioSessions.push(newSessionsData);
            }

            wrapper = shallow(<AudioSessionChart data={newData} />);
            linesWrapper = wrapper.find(Line);
        });

        it ("Tests the lines are created.", function() {
            expect(linesWrapper).to.have.length(1);
        });
    });
});
