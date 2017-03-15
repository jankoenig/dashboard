import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import TimeChart, { LineProps, TimeData } from "./TimeChart";

const expect = chai.expect;

const DATA_LENGTH = 10;

const data: TimeData[] = [];

describe("CountChart", function () {

    let lines: LineProps[];

    before(function () {
        let date: Date = new Date();
        for (let i = 0; i < DATA_LENGTH; ++i) {
            const newData: any = new TimeData(date);
            newData["count"] = i;
            data.push(newData);
            date.setDate(date.getDate() - 1);
        }
        lines = [{
            dataKey: "count",
        }];
    });

    it("renders properly", function () {
        const wrapper: ShallowWrapper<any, any> = shallow(<TimeChart data={data} lines={lines} />);
        expect(wrapper.find(ResponsiveContainer)).to.have.length(1);

        const responsiveContainer: ShallowWrapper<any, any> = wrapper.childAt(0);

        expect(responsiveContainer.find(Line)).to.have.length(1);
        expect(responsiveContainer.find(LineChart)).to.have.length(1);
        expect(responsiveContainer.find(Tooltip)).to.have.length(1);
        expect(responsiveContainer.find(XAxis)).to.have.length(1);
        expect(responsiveContainer.find(YAxis)).to.have.length(1);
    });

    describe("Props test", function () {
        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            wrapper = shallow(<TimeChart data={data} lines={lines} />);
        });

        it("Tests that the data sent in props makes it to it's final destination.", function () {
            expect(wrapper.find(LineChart).prop("data")).to.equal(data);
        });
    });

    describe("TimeData tests", function() {
        it("Tests that compare returns 0 on equal.", function() {
            const b1 = new TimeData(new Date(2017, 5, 5, 5, 5));
            const b2 = new TimeData(new Date(2017, 5, 5, 5, 5));

            expect(b1.compare(b2)).to.equal(0);
            expect(b2.compare(b1)).to.equal(0);
        });

        it("Tests that compare returns negative when b1 is later than b2.", function() {
            const b1 = new TimeData(new Date(2017, 5, 5, 5, 4));
            const b2 = new TimeData(new Date(2017, 5, 5, 5, 5));

            expect(b1.compare(b2)).to.lessThan(0);
        });

        it("Tests that compare returns negative when b1 is sooner than b2.", function() {
            const b1 = new TimeData(new Date(2017, 5, 5, 5, 6));
            const b2 = new TimeData(new Date(2017, 5, 5, 5, 5));

            expect(b1.compare(b2)).to.greaterThan(0);
        });
    });

    describe("Lines tests", function () {
        let wrapper: ShallowWrapper<any, any>;
        let linesWrapper: ShallowWrapper<any, any>;

        let lines: LineProps[];

        let newData: TimeData[];

        before(function () {
            lines = [{
                dataKey: "key1",
                name: "name1",
                stroke: "#FF0000"
            }, {
                dataKey: "key2",
                name: "name2",
                stroke: "#00FF00"
            }, {
                dataKey: "key3",
                name: "name3",
                stroke: "#0000FF"
            }];

            let date: Date = new Date();
            newData = [];
            for (let i = 0; i < DATA_LENGTH; ++i) {
                const data: any = new TimeData(date);
                date.setDate(date.getDate() - 1);
                data["key1"] = i + 5;
                data["key2"] = i + 6;
                data["key3"] = i + 7;
                newData.push(data);
            }

            wrapper = shallow(<TimeChart data={newData} lines={lines} />);
            linesWrapper = wrapper.find(Line);
        });

        it ("Tests the lines are created.", function() {
            expect(linesWrapper).to.have.length(3);
        });

        it("Tests the lines have the appropriate props.", function() {
            checkBarProps(linesWrapper.at(0), lines[0]);
            checkBarProps(linesWrapper.at(1), lines[1]);
            checkBarProps(linesWrapper.at(2), lines[2]);
        });
    });
});

/**
 * Bars get a lot more props added to them post render so we're going to just check the ones that
 * we control.
 */
function checkBarProps(barWrapper: ShallowWrapper<any, any>, lines: any) {
    Object.keys(lines).forEach((value: string, index: number, arr: string[]) => {
        expect(barWrapper.prop(value)).to.deep.equal(lines[value]);
    });
}