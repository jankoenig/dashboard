import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as moment from "moment";
import * as React from "react";
import { Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import UpTimeChart, { UpTimeData } from "./UpTimeChart";

const expect = chai.expect;

const DATA_LENGTH = 10;

const data: UpTimeData[] = [];

describe("IntervalChart", function () {

    before(function () {
        for (let i = 0; i < DATA_LENGTH; ++i) {
            const newData: any = {};
            newData["status"] = "up";
            newData["statusValue"] = 1;
            newData["timestamp"] = moment().diff(i, "minutes");
            data.push(newData);
        }
    });

    it("renders properly", function () {
        const wrapper: ShallowWrapper<any, any> = shallow(<UpTimeChart data={data} />);
        expect(wrapper.find(ResponsiveContainer)).to.have.length(1);

        const responsiveContainer: ShallowWrapper<any, any> = wrapper.childAt(0);
        expect(responsiveContainer.find(Line)).to.have.length(1);
        expect(responsiveContainer.find(LineChart)).to.have.length(1);
        expect(responsiveContainer.find(XAxis)).to.have.length(1);
        expect(responsiveContainer.find(YAxis)).to.have.length(1);
        expect(responsiveContainer.find(Legend)).to.have.length(1);
    });

    describe("Props test", function () {
        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            wrapper = shallow(<UpTimeChart data={data} />);
        });

        it("Tests that the data sent in props makes it to it's final destination.", function () {
            expect(wrapper.find(LineChart).prop("data")).to.equal(data);
        });
    });

    describe("Lines tests", function () {
        let wrapper: ShallowWrapper<any, any>;
        let linesWrapper: ShallowWrapper<any, any>;

        let newData: UpTimeData[];

        before(function () {
            newData = [];
            for (let i = 0; i < DATA_LENGTH; ++i) {
                const data: any = {};
                data["status"] = "up";
                data["statusValue"] = 1;
                data["timestamp"] = moment().diff(i, "minutes");
                newData.push(data);
            }

            wrapper = shallow(<UpTimeChart data={newData} />);
            linesWrapper = wrapper.find(Line);
        });

        it ("Tests the lines are created.", function() {
            expect(linesWrapper).to.have.length(1);
        });
    });
});
