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

        const dropdown = wrapper.find("ThemedDropdown");
        expect(dropdown.prop("label")).to.equal("Log Level");
        expect(dropdown.prop("onChange")).to.not.be.undefined;

        const logtypes = wrapper.state("logTypes");

        expect(dropdown.prop("source")).to.equal(logtypes);
        expect(dropdown.prop("value")).to.equal(logtypes[0].value);
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
        });
    });
});