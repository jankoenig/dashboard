import * as chai from "chai";
import { shallow, ShallowWrapper} from "enzyme";
import * as React from "react";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import CountChart, { CountData } from "./CountChart";

const expect = chai.expect;

const DATA_LENGTH = 10;

const data: CountData[] = [];

describe("CountChart", function() {

    before(function() {
        for (let i = 0; i < DATA_LENGTH; ++i) {
            data.push({
                title: "title" + i,
                count: i
            });
        }
    });

    it ("renders properly", function() {
        const wrapper: ShallowWrapper<any, any> = shallow(<CountChart data={data} />);
        expect(wrapper.find(ResponsiveContainer)).to.have.length(1);

        const responsiveContainer: ShallowWrapper<any, any> = wrapper.childAt(0);

        expect(responsiveContainer.find(Bar)).to.have.length(1);
        expect(responsiveContainer.find(BarChart)).to.have.length(1);
        expect(responsiveContainer.find(Tooltip)).to.have.length(1);
        expect(responsiveContainer.find(XAxis)).to.have.length(1);
        expect(responsiveContainer.find(YAxis)).to.have.length(1);
    });

    describe("Props tests", function() {

        let wrapper: ShallowWrapper<any, any>;

        before(function() {
            wrapper = shallow(<CountChart data={data} />);
        });

        it ("Tests that the data passed from props makes it to it's desired destination.", function() {
            expect(wrapper.find(BarChart).prop("data")).to.equal(data);
        });
    });
});