import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";

import Convo, { Origin } from "../../models/conversation";
import Source from "../../models/source";
import DateUtil from "../../utils/date";
import { dummyConversationList, dummySources } from "../../utils/test";
import ConvoExplorerPage from "./ConvoExplorerPage";
import { ConvoPage } from "./ConvoPage";
import FilterBar, { DateRange } from "./FilterBar";
import { DateFilter, ExceptionFilter, IntentFilter, LogLevelFilter, OriginFilter, RequestFilter, UserIDFilter } from "./filters/ConvoFilters";
import { CompositeFilter } from "./filters/Filters";

const expect = chai.expect;

describe("ConvoPage", function () {

    let source: Source;

    before(function () {
        source = dummySources(1)[0];
    });

    describe("Renders", function () {
        let wrapper: ShallowWrapper<any, any>;

        beforeEach(function () {
            wrapper = shallow(<ConvoPage
                source={source} />);
        });

        it("Checks the filterbar exists.", function () {
            expect(wrapper.find(FilterBar)).to.have.length(1);
        });

        it("Checks the default props are passed to the Filterbar", function () {
            const filterbar = wrapper.find(FilterBar).at(0);
            expect(filterbar).to.have.prop("liveUpdateEnabled", true);

            const dateRange: DateRange = filterbar.prop("dateRange");

            expect(dateRange).to.exist;
            expect(dateRange.startTime).to.equalDate(DateUtil.daysAgo(7));
            expect(dateRange.endTime).to.equalDate(DateUtil.daysAgo(0));
        });

        it("Checks the ConvoExplorer exists.", function () {
            expect(wrapper.find(ConvoExplorerPage)).to.have.length(1);
        });

        it("Checks the default props are passed to the ConvoExplorer", function () {
            const explorer = wrapper.find(ConvoExplorerPage);

            expect(explorer).to.have.prop("refreshOn", true);
        });
    });

    describe("Actions", function () {

        let wrapper: ShallowWrapper<any, any>;
        let explorer: ShallowWrapper<any, any>;

        beforeEach(function () {
            wrapper = shallow(<ConvoPage
                source={source} />);
        });

        describe("Explorer", function() {
            let explorer: ShallowWrapper<any, any>;

            beforeEach(function() {
                explorer = wrapper.find(ConvoExplorerPage).at(0);
            });

            it("Tests the icon click action filters users.", function() {
                const convo = dummyConversationList(1)[0];

                explorer.simulate("iconClick", convo);

                // Get the new one.
                explorer = wrapper.find(ConvoExplorerPage).at(0);

                const filterProp = explorer.prop("filter") as CompositeFilter<Convo>;

                const userIDFilter = filterProp.getFilter(UserIDFilter.type) as UserIDFilter;
                expect(userIDFilter).to.exist;
                expect(userIDFilter.userID).to.equal(convo.userId);
            });
        });

        describe("FilterBar", function () {

            let filterbar: ShallowWrapper<any, any>;

            beforeEach(function () {
                filterbar = wrapper.find(FilterBar).at(0);
            });

            it("Tests that onLiveUpdate performs correctly.", function () {
                filterbar.simulate("liveUpdate", false);

                explorer = wrapper.find(ConvoExplorerPage).at(0);

                expect(explorer).to.have.prop("refreshOn", false);
            });

            it("Tests that onFilterDate adds a filter to the explorer", function () {
                const dateFilter = new DateFilter(DateUtil.daysAgo(4), DateUtil.daysAgo(2));
                filterbar.simulate("filterDate", dateFilter);

                explorer = wrapper.find(ConvoExplorerPage).at(0);
                const filters: CompositeFilter<Convo> = explorer.prop("filter");

                expect(filters.getFilter(DateFilter.type)).to.deep.equal(dateFilter);
            });

            it("Tests that onFilterIntent adds a filter to the explorer", function () {
                const filter = new IntentFilter("Test");
                filterbar.simulate("filterIntent", filter);

                explorer = wrapper.find(ConvoExplorerPage).at(0);
                const filters: CompositeFilter<Convo> = explorer.prop("filter");

                expect(filters.getFilter(IntentFilter.type)).to.deep.equal(filter);
            });

            it("Tests that onFilterLogLevel adds a filter to the explorer", function () {
                const filter = new LogLevelFilter("DEBUG");
                filterbar.simulate("filterLogLevel", filter);

                explorer = wrapper.find(ConvoExplorerPage).at(0);
                const filters: CompositeFilter<Convo> = explorer.prop("filter");

                expect(filters.getFilter(LogLevelFilter.type)).to.deep.equal(filter);
            });

            it("Tests that onFilterException adds a filter to the explorer", function () {
                const filter = new ExceptionFilter();
                filterbar.simulate("filterException", filter);

                explorer = wrapper.find(ConvoExplorerPage).at(0);
                const filters: CompositeFilter<Convo> = explorer.prop("filter");

                expect(filters.getFilter(ExceptionFilter.type)).to.deep.equal(filter);
            });

            it("Tests that onFilterRequest adds a filter to the explorer", function () {
                const filter = new RequestFilter("TestRequest");
                filterbar.simulate("filterRequest", filter);

                explorer = wrapper.find(ConvoExplorerPage).at(0);
                const filters: CompositeFilter<Convo> = explorer.prop("filter");

                expect(filters.getFilter(RequestFilter.type)).to.deep.equal(filter);
            });

            it("Tests that onFilterOrigin adds a filter to the explorer", function () {
                const filter = new OriginFilter(Origin.AmazonAlexa);
                filterbar.simulate("filterOrigin", filter);

                explorer = wrapper.find(ConvoExplorerPage).at(0);
                const filters: CompositeFilter<Convo> = explorer.prop("filter");

                expect(filters.getFilter(OriginFilter.type)).to.deep.equal(filter);
            });
        });
    });
});