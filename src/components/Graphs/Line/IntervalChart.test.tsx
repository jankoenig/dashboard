import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as moment from "moment";
import * as React from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import IntervalChart, { IntervalData } from "./IntervalChart";

const expect = chai.expect;

const DATA_LENGTH = 10;

const data: IntervalData[] = [];

describe("IntervalChart", function () {

    before(function () {
        for (let i = 0; i < DATA_LENGTH; ++i) {
            const newData: any = new IntervalData();
            newData["avgResponseTime"] = i;
            newData["interval"] = i;
            newData["intervalDate"] = moment().subtract(i, "minutes");
            data.push(newData);
        }
    });

    it("renders properly", function () {
        const wrapper: ShallowWrapper<any, any> = shallow(<IntervalChart data={data} />);
        expect(wrapper.find(ResponsiveContainer)).to.have.length(1);

        const responsiveContainer: ShallowWrapper<any, any> = wrapper.childAt(0);
        expect(responsiveContainer.find(Line)).to.have.length(1);
        expect(responsiveContainer.find(LineChart)).to.have.length(1);
        expect(responsiveContainer.find(XAxis)).to.have.length(1);
        expect(responsiveContainer.find(YAxis)).to.have.length(1);
        expect(responsiveContainer.find(CartesianGrid)).to.have.length(1);
        expect(responsiveContainer.find(Legend)).to.have.length(1);
    });

    describe("Props test", function () {
        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            wrapper = shallow(<IntervalChart data={data} />);
        });

        it("Tests that the data sent in props makes it to it's final destination.", function () {
            expect(wrapper.find(LineChart).prop("data")).to.equal(data);
        });
    });

    describe("Lines tests", function () {
        let wrapper: ShallowWrapper<any, any>;
        let linesWrapper: ShallowWrapper<any, any>;

        let newData: IntervalData[];

        before(function () {
            newData = [];
            for (let i = 0; i < DATA_LENGTH; ++i) {
                const data: any = new IntervalData();
                data["avgResponseTime"] = i;
                data["interval"] = i;
                data["intervalDate"] = moment().subtract(i, "hours");
                newData.push(data);
            }

            wrapper = shallow(<IntervalChart data={newData} />);
            linesWrapper = wrapper.find(Line);
        });

        it ("Tests the lines are created.", function() {
            expect(linesWrapper).to.have.length(1);
        });
    });
});
