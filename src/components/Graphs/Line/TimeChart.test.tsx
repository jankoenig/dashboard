import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import TimeChart from "./TimeChart";

const expect = chai.expect;

const DATA_LENGTH = 10;

const data: any[] = [];

describe("CountChart", function() {

    before(function() {
        let date: Date = new Date();
        for (let i = 0; i < DATA_LENGTH; ++i) {
            data.push({
                isoDate: date.toISOString(),
                count: i
            });
        }
    });

    it ("renders properly", function() {
        const wrapper: ShallowWrapper<any, any> = shallow(<TimeChart data={data} />);
        expect(wrapper.find(ResponsiveContainer)).to.have.length(1);

        const responsiveContainer: ShallowWrapper<any, any> = wrapper.childAt(0);

        expect(responsiveContainer.find(Line)).to.have.length(1);
        expect(responsiveContainer.find(LineChart)).to.have.length(1);
        expect(responsiveContainer.find(Tooltip)).to.have.length(1);
        expect(responsiveContainer.find(XAxis)).to.have.length(1);
        expect(responsiveContainer.find(YAxis)).to.have.length(1);
    });

    describe("Props test", function() {
        let wrapper: ShallowWrapper<any, any>;

        before(function() {
            wrapper = shallow(<TimeChart data={data} />);
        });

        it ("Tests that the data sent in props makes it to it's final destination.", function() {
            expect(wrapper.find(LineChart).prop("data")).to.equal(data);
        });
    });
});