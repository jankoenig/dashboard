import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import CountChart, { BarProps, CountData } from "./CountChart";

const expect = chai.expect;

const DATA_LENGTH = 10;

const data: CountData[] = [];

describe("CountChart", function () {

    before(function () {
        for (let i = 0; i < DATA_LENGTH; ++i) {
            data.push({
                title: "title" + i,
                count: i
            });
        }
    });

    it("renders properly", function () {
        const wrapper: ShallowWrapper<any, any> = shallow(<CountChart data={data} />);
        expect(wrapper.find(ResponsiveContainer)).to.have.length(1);

        const responsiveContainer: ShallowWrapper<any, any> = wrapper.childAt(0);

        expect(responsiveContainer.find(Bar)).to.have.length(1);
        expect(responsiveContainer.find(BarChart)).to.have.length(1);
        expect(responsiveContainer.find(Tooltip)).to.have.length(1);
        expect(responsiveContainer.find(XAxis)).to.have.length(1);
        expect(responsiveContainer.find(YAxis)).to.have.length(1);
    });

    describe("Props tests", function () {

        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            wrapper = shallow(<CountChart data={data} />);
        });

        it("Tests that the data passed from props makes it to it's desired destination.", function () {
            expect(wrapper.find(BarChart).prop("data")).to.equal(data);
        });
    });

    describe("Bars tests", function () {
        let wrapper: ShallowWrapper<any, any>;
        let barWrapper: ShallowWrapper<any, any>;
        let bars: BarProps[];

        let mixedData: CountData[];

        before(function () {
            bars = [{
                dataKey: "key1",
                fill: "#FF0000",
                name: "name1",
                stackId: "id1"
            }, {
                dataKey: "key2",
                fill: "#00FF00",
                name: "name2",
                stackId: "id2"
            }, {
                dataKey: "key3",
                fill: "#0000FF",
                name: "name3",
                stackId: "id3"
            }];

            mixedData = [];
            for (let i = 0; i < 15; i++) {
                const newData: any = { title: "title" + i, count: i };
                newData["key1"] = i + 5;
                newData["key2"] = i + 6;
                newData["key3"] = i + 7;
                mixedData.push(newData);
            }

            wrapper = shallow(<CountChart data={mixedData} bars={bars} />);
            barWrapper = wrapper.find(Bar);
        });

        it("Checks the data created the bars.", function() {
            expect(barWrapper).to.have.length(3);
        });

        it("Checks the bar props given.", function() {
            checkBarProps(barWrapper.at(0), bars[0]);
            checkBarProps(barWrapper.at(1), bars[1]);
            checkBarProps(barWrapper.at(2), bars[2]);
        });
    });
});

/**
 * Bars get a lot more props added to them post render so we're going to just check the ones that
 * we control.
 */
function checkBarProps(barWrapper: ShallowWrapper<any, any>, bar: BarProps) {
    Object.keys(bar).forEach((value: string, index: number, arr: string[]) => {
        expect(barWrapper.prop(value)).to.deep.equal((bar as any)[value]);
    });
}