import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import Checkbox from "react-toolbox/lib/checkbox";
import DatePicker from "react-toolbox/lib/date_picker";
import Dropdown from "react-toolbox/lib/dropdown";
import Input from "react-toolbox/lib/input";

import { Origin } from "../../../models/conversation";
import Dateutils from "../../../utils/date";
import { OriginFilter } from "../filters/ConvoFilters";
import Filterbar, { DateRange, FilterProps, FilterState } from "./FilterBar";

chai.use(sinonChai);
chai.use(require("chai-datetime"));
const expect = chai.expect;

describe("Filter Bar", function () {
    let onFilter: Sinon.SinonSpy;
    let logQuery: DateRange;
    let wrapper: ShallowWrapper<FilterProps, FilterState>;

    before(function () {
        onFilter = sinon.spy();
        logQuery = {
            startTime: Dateutils.daysAgo(3),
            endTime: Dateutils.daysAgo(0)
        };
    });

    beforeEach(function () {
        onFilter.reset();
        wrapper = shallow((
            <Filterbar
                onFilterDate={onFilter}
                onFilterIntent={onFilter}
                onFilterLogLevel={onFilter}
                onFilterException={onFilter}
                onFilterRequest={onFilter}
                onFilterOrigin={onFilter}
                onLiveUpdate={onFilter}
                liveUpdateEnabled={true}
                dateRange={logQuery} />
        )) as ShallowWrapper<FilterProps, FilterState>;
    });

    it("Renders correctly", function () {
        let onFilter = sinon.spy();
        let logQuery = {
            startTime: Dateutils.daysAgo(3),
            endTime: Dateutils.daysAgo(0)
        };

        let wrapper = shallow((
            <Filterbar
                onFilterDate={onFilter}
                onFilterIntent={onFilter}
                onFilterLogLevel={onFilter}
                onFilterException={onFilter}
                onFilterRequest={onFilter}
                onFilterOrigin={onFilter}
                onLiveUpdate={onFilter}
                liveUpdateEnabled={true}
                dateRange={logQuery} />
        ));

        expect(wrapper.find(Dropdown)).to.have.length(2); // Filter by type and origin
        expect(wrapper.find(DatePicker)).to.have.length(2); // Filter by date range
        expect(wrapper.find(Checkbox)).to.have.length(2); // Filter by exception and Live update
        expect(wrapper.find(Input)).to.have.length(2); // Filter by request and intent
    });

    describe("Props passing.", function () {
        it("Gives the appropriate props to the origin dropdown component.", function () {
            const dropdown = wrapper.find(Dropdown).at(0);
            expect(dropdown.prop("label")).to.equal("Origin");
            expect(dropdown.prop("onChange")).to.not.be.undefined;

            const origins = wrapper.state("origins");

            expect(dropdown.prop("source")).to.equal(origins);
            expect(dropdown.prop("value")).to.equal(origins[0].value);
        });

        it("Gives the appropriate props to the origin dropdown component.", function () {
            const dropdown = wrapper.find(Dropdown).at(0);
            expect(dropdown.prop("label")).to.equal("Origin");
            expect(dropdown.prop("onChange")).to.not.be.undefined;

            const origins = wrapper.state("origins");

            expect(dropdown.prop("source")).to.equal(origins);
            expect(dropdown.prop("value")).to.equal(origins[0].value);
        });

        it("Gives the appropriate props to the log level dropdown component.", function () {
            const dropdown = wrapper.find(Dropdown).at(1);
            expect(dropdown.prop("label")).to.equal("Log Level");
            expect(dropdown.prop("onChange")).to.not.be.undefined;

            const logtypes = wrapper.state("logTypes");

            expect(dropdown.prop("source")).to.equal(logtypes);
            expect(dropdown.prop("value")).to.equal(logtypes[0].value);
        });

        it("Gives the appropriate props to the request input component.", function () {
            const input = wrapper.find(Input).at(0);
            expect(input.prop("label")).to.equal("Request");
            expect(input.prop("type")).to.equal("text");
            expect(input.prop("onChange")).to.not.be.undefined;
            expect(input.prop("value")).to.be.undefined;
        });

        it("Gives the appropriate props to the intent input component.", function () {
            const input = wrapper.find(Input).at(1);
            expect(input.prop("label")).to.equal("Intent");
            expect(input.prop("type")).to.equal("text");
            expect(input.prop("onChange")).to.not.be.undefined;
            expect(input.prop("value")).to.be.undefined;
        });

        it("Gives the appropriate props to the exceptions checkbox component.", function () {
            const checkbox = wrapper.find(Checkbox).at(0);
            expect(checkbox.prop("label")).to.equal("With Exceptions");
            expect(checkbox.prop("checked")).to.be.false;
            expect(checkbox.prop("onChange")).to.not.be.null;
        });

        it("Gives the appropriate props to the start date picker.", function () {
            const startDatePicker = wrapper.find(DatePicker).at(0);

            expect(startDatePicker.prop("label")).to.equal("Start Date");
            expect(startDatePicker.prop("minDate")).to.be.undefined;
            expect(startDatePicker.prop("maxDate")).to.equalDate(new Date());
            expect(startDatePicker.prop("value")).to.equal(wrapper.state("startDate"));
            expect(startDatePicker.prop("onChange")).to.not.be.undefined;
            expect(startDatePicker.prop("readonly")).to.equal(false);
        });

        it("Gives the appropriate props to the end date picker.", function () {
            const endDatePicker = wrapper.find(DatePicker).at(1);
            expect(endDatePicker.prop("label")).to.equal("End Date");
            expect(endDatePicker.prop("minDate")).to.equal(wrapper.state("startDate"));
            expect(endDatePicker.prop("maxDate")).to.equalDate(new Date());
            expect(endDatePicker.prop("value")).to.be.equal(wrapper.state("endDate"));
            expect(endDatePicker.prop("onChange")).to.not.be.undefined;
            expect(endDatePicker.prop("readonly")).to.equal(false);
        });

        it("Gives the appropriate props to the live update checkbox.", function () {
            const liveUpdate = wrapper.find(Checkbox).at(1);
            expect(liveUpdate.prop("checked")).to.be.true;
            expect(liveUpdate.prop("onChange")).to.exist;
        });
    });

    describe("Filters", function () {

        describe("Origin Filters", function () {

            let dropdown: ShallowWrapper<any, any>;
            let logTypes: any;

            beforeEach(function () {
                dropdown = wrapper.find(Dropdown).at(0);
                logTypes = wrapper.state("logTypes");
            });

            it("Tests the state after a type filter change.", function () {
                dropdown.simulate("change", "Alexa");

                expect(wrapper.state("selectedOrigin")).to.equal("Alexa");
            });

            it("Tests the returned origin filter for alexa", function () {
                dropdown.simulate("change", "Alexa");

                expect(onFilter).to.have.been.calledOnce;

                const filter: OriginFilter = onFilter.args[0][0];

                expect(filter.origin).to.equal(Origin.AmazonAlexa);
            });

            it("Tests the returned origin filter for Home", function () {
                dropdown.simulate("change", "Home");

                expect(onFilter).to.have.been.calledOnce;

                const filter: OriginFilter = onFilter.args[0][0];

                expect(filter.origin).to.equal(Origin.GoogleHome);
            });

            it("Tests the returned origin filter for unknown", function() {
                dropdown.simulate("change", "Uknown");

                expect(onFilter).to.have.been.calledOnce;

                const filter: OriginFilter = onFilter.args[0][0];

                expect(filter.origin).to.not.exist;
            });

            it("Tests the callback is called on type filter change.", function () {
                dropdown.simulate("change", "Alexa");

                expect(onFilter).to.have.been.calledOnce;
            });
        });

        describe("Type Filters", function () {

            let dropdown: ShallowWrapper<any, any>;
            let logTypes: any;

            beforeEach(function () {
                dropdown = wrapper.find(Dropdown).at(1);
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

                date.setHours(0, 0, 0, 0);

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

                date.setHours(23, 59, 59, 999);

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

        describe("Exception Filters", function () {

            let checkboxWrapper: ShallowWrapper<any, any>;

            beforeEach(function () {
                checkboxWrapper = wrapper.find(Checkbox).at(0);
            });

            it("Tests state after an exceptions change.", function () {
                checkboxWrapper.simulate("change", true);

                expect(wrapper.state("exceptionsOnly")).to.be.true;

                checkboxWrapper = wrapper.find(Checkbox).at(0);

                expect(checkboxWrapper.prop("checked")).to.be.true;
            });

            it("Tests callback was called after exceptions change.", function () {
                checkboxWrapper.simulate("change", true);

                expect(onFilter).to.be.calledOnce;
            });
        });

        describe("Request Filter", function () {
            let requestWrapper: ShallowWrapper<any, any>;

            beforeEach(function () {
                requestWrapper = wrapper.find(Input).at(0);
            });

            it("Tests state after an input change.", function () {
                requestWrapper.simulate("change", "new value");

                expect(wrapper.state("requestValue")).to.equal("new value");

                // It re-renders so need the new one.
                requestWrapper = wrapper.find(Input).at(0);

                expect(requestWrapper.prop("value")).to.equal("new value");
            });

            it("Tests callback was called after input change.", function () {
                requestWrapper.simulate("change", "new value");

                expect(onFilter).to.be.calledOnce;
            });
        });

        describe("Intent Filter", function () {
            let intentWrapper: ShallowWrapper<any, any>;

            beforeEach(function () {
                intentWrapper = wrapper.find(Input).at(1);
            });

            it("Tests state after an input change.", function () {
                intentWrapper.simulate("change", "new value");

                expect(wrapper.state("intentValue")).to.equal("new value");

                intentWrapper = wrapper.find(Input).at(1);
                expect(intentWrapper.prop("value")).to.equal("new value");
            });

            it("Tests callback was called after input change.", function () {
                intentWrapper.simulate("change", "new value");

                expect(onFilter).to.be.calledOnce;
            });
        });

        describe("Live Update", function () {
            let updateWrapper: ShallowWrapper<any, any>;

            beforeEach(function () {
                updateWrapper = wrapper.find(Checkbox).at(1);
            });

            it("Tests the callback was called after an input change.", function () {
                updateWrapper.simulate("change", true);

                expect(onFilter).to.be.calledOnce;
                expect(onFilter).to.be.calledWith(true);
            });

            it("Tests the live update is disabled when props set.", function () {
                const newProps = { ...wrapper.props(), ...{ disableLiveUpdateCheckbox: true } };
                wrapper.setProps(newProps);

                updateWrapper = wrapper.find(Checkbox).at(1);
                expect(updateWrapper.prop("disabled")).to.be.true;
            });
        });
    });
});