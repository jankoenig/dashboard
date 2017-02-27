import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import Conversation from "../../models/conversation";
import ConversationList from "../../models/conversation-list";
import Log from "../../models/log";
import LogQuery from "../../models/log-query";
import Source from "../../models/source";
import DateUtils from "../../utils/date";
import { dummyLogs, dummySources } from "../../utils/test";
import { ConvoListPage } from "./ConvoListPage";
import { DateFilter } from "./filters/ConvoFilters";
import { CompositeFilter } from "./filters/Filters";
import FilteredConvoList from "./list/FilterableConvoList";

chai.use(sinonChai);
const expect = chai.expect;

const iconStyle = {
    width: "100%",
    height: "100px"
};

const tooltip = "TestTooltip";

describe("ConvoListPage", function () {

    let source: Source;
    let logs: Log[];
    let nextPage: Log[];
    let baseConversations: ConversationList;
    let fullNextPageConvoersations: ConversationList;
    let getLogs: Sinon.SinonStub;
    let newPage: Sinon.SinonStub;
    let refresh: Sinon.SinonStub;
    let onItemClick: Sinon.SinonStub;
    let onIconClick: Sinon.SinonStub;

    before(function () {
        source = dummySources(1)[0];
        logs = dummyLogs(30);
        nextPage = dummyLogs(10);
        const both = logs.concat(nextPage);

        baseConversations = ConversationList.fromLogs(logs);
        fullNextPageConvoersations = ConversationList.fromLogs(logs);

        getLogs = sinon.stub().returns(Promise.resolve(logs));
        newPage = sinon.stub().returns(Promise.resolve({ oldLogs: logs, newLogs: nextPage, total: both }));
        refresh = sinon.stub().returns(Promise.resolve({ oldLogs: logs, newLogs: nextPage, total: both }));

        onItemClick = sinon.stub();
        onIconClick = sinon.stub();
    });

    afterEach(function () {
        getLogs.reset();
        newPage.reset();
        refresh.reset();
        onItemClick.reset();
        onIconClick.reset();
    });

    describe("Renders", function () {

        let filter: CompositeFilter<Conversation>;
        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            filter = new CompositeFilter([]);
        });

        beforeEach(function () {
            wrapper = shallow(
                <ConvoListPage
                    isLoading={false}
                    source={source}
                    newPage={newPage}
                    refresh={refresh}
                    getLogs={getLogs}
                    onIconClick={onIconClick}
                    onItemClick={onItemClick}
                    filter={filter}
                    iconTooltip={tooltip}
                    iconStyle={iconStyle}
                />);
        });

        it("Tests the FilterableConvoList exists.", function () {
            expect(wrapper.find(FilteredConvoList)).to.have.length(1);
        });

        it("Tests the FilterableConvoList has the appropriate props.", function () {
            const listWrapper = wrapper.find(FilteredConvoList);
            expect(listWrapper).to.have.prop("filter", filter);
            expect(listWrapper).to.have.prop("iconTooltip", tooltip);
            expect(listWrapper.prop("iconStyle")).to.equal(iconStyle); // The have.prop method seems to be different.
        });

        it("Tests that the \"getLogs\" is called on mount", function () {
            expect(getLogs).to.be.calledOnce;
        });

        describe("getLogs", function () {

            let dateFilter: DateFilter;

            before(function () {
                dateFilter = new DateFilter(DateUtils.daysAgo(5), DateUtils.daysAgo(2));
                filter = filter.copyAndAddOrReplace(dateFilter);
            });

            beforeEach(function () {
                wrapper = shallow(
                    <ConvoListPage
                        isLoading={false}
                        source={source}
                        newPage={newPage}
                        refresh={refresh}
                        getLogs={getLogs}
                        filter={filter}
                    />);
            });

            it("Tests that the LogQuery is correct when a DateFilter is applied.", function() {
                const logQuery: LogQuery = getLogs.args[0][0];

                expect(logQuery.startTime).to.equalDate(dateFilter.startDate);
                expect(logQuery.endTime).to.equalDate(dateFilter.endDate);
            });
        });
    });

    describe("Actions", function() {
        let filter: CompositeFilter<Conversation>;
        let wrapper: ShallowWrapper<any, any>;
        let listWrapper: ShallowWrapper<any, any>;

        before(function () {
            filter = new CompositeFilter([]);
        });

        beforeEach(function () {
            wrapper = shallow(
                <ConvoListPage
                    isLoading={false}
                    source={source}
                    newPage={newPage}
                    refresh={refresh}
                    getLogs={getLogs}
                    onIconClick={onIconClick}
                    onItemClick={onItemClick}
                    filter={filter}
                />);

            listWrapper = wrapper.find(FilteredConvoList);
        });

        it("Tests that iconClick triggers an event", function() {
            listWrapper.simulate("iconClick", baseConversations[0]);

            expect(onIconClick).to.have.been.calledOnce;
            expect(onIconClick).to.have.been.calledWith(baseConversations[0]);
        });

        it("Tests that the itemClick triggers an event", function() {
            listWrapper.simulate("itemClick", baseConversations[0]);

            expect(onItemClick).to.have.been.calledOnce;
            expect(onItemClick).to.have.been.calledWith(baseConversations[0]);
        });
    });
});