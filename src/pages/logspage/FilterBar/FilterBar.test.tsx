import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import DatePicker from "react-toolbox/lib/date_picker";
import Dropdown from "react-toolbox/lib/dropdown";

import Filterbar, { FilterProps, FilterState } from "./FilterBar";

import Source from "../../../models/source";

import LogQuery from "../../../models/log-query";

chai.use(sinonChai);
chai.use(require("chai-datetime"));
const expect = chai.expect;

describe("Filter Bar", function () {

    it("Renders correctly", function () {
        let source = new Source({
            name: "TestSource"
        });
        let onFilter = sinon.spy();
        let logQuery = new LogQuery({ source: source });

        let wrapper = shallow(<Filterbar onFilter={onFilter} query={logQuery} />);

        expect(wrapper.find(Dropdown)).to.have.length(1); // Filter by type.
        expect(wrapper.find(DatePicker)).to.have.length(2); // filter by date range
    });

    it("Gives the appropriate props to the dropdown component.", function () {
        let source = new Source({
            name: "TestSource"
        });
        let onFilter = sinon.spy();
        let logQuery = new LogQuery({ source: source });

        let wrapper = shallow(<Filterbar onFilter={onFilter} query={logQuery} />);

        const dropdown = wrapper.find(Dropdown);
        expect(dropdown.prop("label")).to.equal("Log Level");
        expect(dropdown.prop("onChange")).to.not.be.undefined;

        const logtypes = wrapper.state("logTypes");

        expect(dropdown.prop("source")).to.equal(logtypes);
        expect(dropdown.prop("value")).to.equal(logtypes[0].value);
    });

    it("Gives the appropriate props to the start date picker.", function () {
        let source = new Source({
            name: "TestSource"
        });
        let onFilter = sinon.spy();
        let logQuery = new LogQuery({ source: source });

        let wrapper = shallow(<Filterbar onFilter={onFilter} query={logQuery} />);

        const startDatePicker = wrapper.find(DatePicker).at(0);

        expect(startDatePicker.prop("label")).to.equal("Start Date");
        expect(startDatePicker.prop("minDate")).to.be.undefined;
        expect(startDatePicker.prop("maxDate")).to.equalDate(new Date());
        expect(startDatePicker.prop("value")).to.equal(wrapper.state("startDate"));
        expect(startDatePicker.prop("onChange")).to.not.be.undefined;
        expect(startDatePicker.prop("readonly")).to.equal(false);
    });

    it("Gives the appropriate props to the end date picker.", function () {
        let source = new Source({
            name: "TestSource"
        });
        let onFilter = sinon.spy();
        let logQuery = new LogQuery({ source: source });

        let wrapper = shallow(<Filterbar onFilter={onFilter} query={logQuery} />);

        const endDatePicker = wrapper.find(DatePicker).at(1);

        expect(endDatePicker.prop("label")).to.equal("End Date");
        expect(endDatePicker.prop("minDate")).to.equal(wrapper.state("startDate"));
        expect(endDatePicker.prop("maxDate")).to.equalDate(new Date());
        expect(endDatePicker.prop("value")).to.be.equal(wrapper.state("endDate"));
        expect(endDatePicker.prop("onChange")).to.not.be.undefined;
        expect(endDatePicker.prop("readonly")).to.equal(false);
    });

    describe("Filters", function () {

        let source: Source;
        let onFilter: Sinon.SinonSpy;
        let logQuery: LogQuery;
        let wrapper: ShallowWrapper<FilterProps, FilterState>;

        before(function () {
            source = new Source({
                name: "TestSource"
            });
            onFilter = sinon.spy();
            logQuery = new LogQuery({ source: source });
        });

        beforeEach(function () {
            onFilter.reset();
            wrapper = shallow(<Filterbar onFilter={onFilter} query={logQuery} />) as ShallowWrapper<FilterProps, FilterState>;
        });

        describe("Type Filters", function () {

            let dropdown: ShallowWrapper<any, any>;
            let logTypes: any;

            beforeEach(function () {
                dropdown = wrapper.find(Dropdown);
                logTypes = wrapper.state("logTypes");
            });

            it("Tests the state after a type filter change.", function () {
                dropdown.simulate("change", "DEBUG");

                expect(wrapper.state("selectedType")).to.equal("DEBUG");
            });

            it("Tests the callback is called on type filter change.", function () {
                dropdown.simulate("change", "DEBUG");

                expect(onFilter).to.have.been.calledOnce;
            });
        });

        describe("Date Filters", function () {
            let startDatePicker: ShallowWrapper<any, any>;
            let endDatePicker: ShallowWrapper<any, any>;

            beforeEach(function () {
                const pickers = wrapper.find(DatePicker);
                startDatePicker = pickers.at(0);
                endDatePicker = pickers.at(1);
            });

            it("Tests state changes when start date picker is chosen.", function () {
                let date = new Date();
                date.setDate(date.getDate() - 3);

                startDatePicker.simulate("change", date);

                date.setHours(0, 0, 0);

                expect(wrapper.state("startDate")).to.equalDate(date);
                expect(wrapper.state("startDate")).to.equalTime(date);
            });

            it("Tests the maximum date of the start date picker is set to the end date when picked.", function () {
                let date = new Date();
                date.setDate(date.getDate() - 3);

                endDatePicker.simulate("change", date);

                startDatePicker = wrapper.find(DatePicker).at(0); // It re-renders so need the new one.

                expect(startDatePicker.prop("maxDate")).to.equalDate(date);
            });

            it("Tests state changes when end date picker is chosen.", function () {
                let date = new Date();
                date.setDate(date.getDate() - 3);

                endDatePicker.simulate("change", date);

                date.setHours(59, 59, 59);

                expect(wrapper.state("endDate")).to.equalDate(date);
                expect(wrapper.state("endDate")).to.equalTime(date);
            });

            it("Tests the minimum date of the end date picker is set to the start date when picked.", function () {
                let date = new Date();
                date.setDate(date.getDate() - 3);

                startDatePicker.simulate("change", date);

                endDatePicker = wrapper.find(DatePicker).at(1); // It re-renders so need the new one.

                expect(endDatePicker.prop("minDate")).to.equalDate(date);
            });
        });
    });
});