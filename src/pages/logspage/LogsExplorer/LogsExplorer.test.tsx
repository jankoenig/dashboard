import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import VisiblityWatcher from "../../../components/VisibilityWatcher";
import Conversation, { createConvo } from "../../../models/conversation";
import ConversationList from "../../../models/conversation-list";
import Log from "../../../models/log";
import LogQuery from "../../../models/log-query";
import Output from "../../../models/output";
import Source from "../../../models/source";
import { LogMap } from "../../../reducers/log";
import browser from "../../../utils/browser";
import Interval from "../../../utils/Interval";
import { dummyLogs, dummyOutputs } from "../../../utils/test";
import LogsExplorer from "./LogsExplorer";

import { FilterBar } from "../FilterBar";
import { DateFilter, UserIDFilter } from "../filters/ConvoFilters";
import FilterableConversationList from "../list/FilterableConvoList";

// Setup chai with sinon-chai
chai.use(sinonChai);
let expect = chai.expect;

describe("LogExplorer", function () {

    describe("without properties", function () {
        let wrapper = shallow(<LogsExplorer source={undefined} logMap={undefined} />);

        it("renders a FilterBar", function () {
            expect(wrapper.find("FilterBar")).to.have.length(1);
        });

        it("does not render an Interaction", function () {
            expect(wrapper.find("Interaction")).to.have.length(0);
        });
    });

    describe("with properties", function () {
        let logs: Log[];
        let outputs: Output[];
        let source: Source;
        let source2: Source;
        let logQuery: LogQuery;
        let logMap: LogMap;
        let convo: Conversation;

        let onFilter: Sinon.SinonStub;
        let onRefresh: Sinon.SinonStub;

        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            logs = dummyLogs(4);
            outputs = dummyOutputs(2);
            source = new Source({ name: "name", id: "id" });
            source2 = new Source({ name: "name", id: "id2" });
            logQuery = new LogQuery({ startTime: new Date(), endTime: new Date(), source: source });
            logMap = {};
            convo = createConvo({ request: logs[0], response: logs[1], outputs: outputs });

            onRefresh = sinon.stub();
            onFilter = sinon.stub().returns(false);

            logMap[source.id] = { logs: logs, query: logQuery };
        });

        beforeEach(function () {
            onRefresh.reset();
            onFilter.reset();
            wrapper = shallow(<LogsExplorer source={source} logMap={logMap} onGetNewLogs={onRefresh} onFilter={onFilter} />);
        });

        it("renders a FilterBar", function () {
            expect(wrapper.find("FilterBar")).to.have.length(1);
        });

        it("Tests the length function", function () {
            expect((wrapper.instance() as LogsExplorer).length()).to.equal(logs.length / 2);
        });

        describe("without a conversation selected", function () {
            it("does not render an Interaction", function () {
                expect(wrapper.find("Interaction")).to.have.length(0);
            });
        });

        describe("Filtering user.", function() {
            let conversationListViewWrapper: ShallowWrapper<any, any>;
            let conversations: ConversationList;

            beforeEach(function() {
                conversationListViewWrapper = wrapper.find(FilterableConversationList);
                conversations = conversationListViewWrapper.prop("conversations");
            });

            it("Tests that a user filter is applied when conversation icon clicked.", function() {
                conversationListViewWrapper.simulate("iconClick", conversations[0]);

                expect(onFilter).to.be.calledOnce;

                let userFilter: UserIDFilter = onFilter.args[0][0];
                expect(userFilter).to.exist;
                expect(userFilter.userID).to.equal(conversations[0].userId);
            });

            it("Tests that a user filter is removed when conversation icon clicked twice.", function() {
                conversationListViewWrapper.simulate("iconClick", conversations[0]);

                conversationListViewWrapper = wrapper.find(FilterableConversationList);

                conversationListViewWrapper.simulate("iconClick", conversations[0]);

                expect(onFilter).to.be.calledTwice;

                let userFilter: UserIDFilter = onFilter.args[1][0];

                expect(userFilter).to.exist;
                expect(userFilter.userID).to.be.undefined;
            });
        });

        describe("with a conversation selected", function () {

            // Set up some stubs
            let isMobileWidthStub: Sinon.SinonStub;
            let onResizeStub: Sinon.SinonStub;
            let sizeStub: Sinon.SinonStub;

            beforeEach(function () {
                isMobileWidthStub = sinon.stub(browser, "isMobileWidth").returns(true);
                onResizeStub = sinon.stub(browser, "onResize");
                sizeStub = sinon.stub(browser, "size").returns({ width: 800, height: 800 });

                // click
                wrapper.find(FilterableConversationList).simulate("itemClick", convo);
            });

            afterEach(function () {
                // and restore them after each test
                isMobileWidthStub.restore();
                onResizeStub.restore();
                sizeStub.restore();
            });

            it("sets the correct request", function () {
                expect(wrapper.state("selectedConvo").request).to.equal(logs[0]);
            });

            it("sets the correct response", function () {
                expect(wrapper.state("selectedConvo").response).to.equal(logs[1]);
            });

            it("sets the log outputs", function () {
                expect(wrapper.state("selectedConvo").outputs[0]).to.equal(outputs[0]);
                expect(wrapper.state("selectedConvo").outputs[1]).to.equal(outputs[1]);
            });

            it("clears conversation on new source in props.", function () {
                wrapper.setProps({
                    source: source2,
                    logMap: logMap
                });

                expect(wrapper.state("selectedConvo")).to.be.undefined;
            });

            it("clears conversation on undefined source in props.", function () {
                wrapper.setProps({
                    source: undefined,
                    logMap: logMap
                });

                expect(wrapper.state("selectedConvo")).to.be.undefined;
            });

            it("does not clear conversation when new props contains same source.", function () {
                wrapper.setProps({
                    source: source,
                    logMap: logMap
                });

                expect(wrapper.state("selectedConvo")).to.exist;
            });
        });

        describe("Tests the refreshing.", function () {

            let stubExecutor: StubExecutor;
            let intervalStub: Sinon.SinonStub;

            before(function () {
                intervalStub = sinon.stub(Interval, "newExecutor", (ms: number, callback: () => void): Interval.Executor => {
                    return stubExecutor = new StubExecutor(ms, callback);
                });
            });

            afterEach(function () {
                stubExecutor.reset();
                intervalStub.reset();
            });

            after(function () {
                intervalStub.restore();
            });

            it("Tests there is a value and callback passed to the exectuor.", function () {
                expect(stubExecutor).to.exist;
                expect(stubExecutor.ms).to.be.greaterThan(0);
                expect(stubExecutor.callback).to.exist;
            });

            it("Tests the interval executor is started by default.", function () {
                expect(stubExecutor.start).to.have.been.calledOnce;
                expect(wrapper.state("tailOn")).to.be.true;
            });

            it("Tests the interval executor is ended when unmounted.", function () {
                wrapper.unmount();
                expect(stubExecutor.end).to.have.been.calledOnce;
            });

            it("Tests the callback when the executor executes the callback.", function () {
                stubExecutor.callback();
                expect(onRefresh).to.have.been.calledOnce;
            });

            it("Tests the auto-refresh is turned off when filterbar activates it.", function () {
                let filterBar = wrapper.find("FilterBar").at(0);
                filterBar.simulate("liveUpdate", false);

                expect(wrapper.state("tailOn")).to.be.false;

                filterBar = wrapper.find("FilterBar").at(0);
                filterBar.simulate("liveUpdate", true);

                expect(wrapper.state("tailOn")).to.be.true;
            });

            describe("Tests the auto turn off when date filters.", function () {

                let filterBar: ShallowWrapper<any, any>;

                beforeEach(function () {
                    filterBar = wrapper.find(FilterBar).at(0);
                });

                it("Tests that the auto-refresh ends when the date filter goes away from today.", function () {
                    const startDate = new Date();
                    startDate.setDate(startDate.getDate() - 12);

                    const endDate = new Date();
                    endDate.setDate(endDate.getDate() - 12);

                    filterBar.simulate("filterDate", new DateFilter(startDate, endDate));

                    expect(stubExecutor.end).to.be.calledOnce;
                    expect(wrapper.state("tailOn")).to.be.false;
                });

                it("Tests that the auto-refresh restarts when the date filter comes back to today.", function () {
                    const startDate = new Date();
                    startDate.setDate(startDate.getDate() - 12);

                    const endDate = new Date();
                    endDate.setDate(endDate.getDate() - 12);

                    filterBar.simulate("filterDate", new DateFilter(startDate, endDate));

                    // get the new one when it re-renders
                    filterBar = wrapper.find(FilterBar).at(0);

                    filterBar.simulate("filterDate", new DateFilter(startDate, new Date()));

                    expect(stubExecutor.end).to.be.calledOnce;
                    expect(stubExecutor.start).to.be.calledTwice;
                    expect(wrapper.state("tailOn")).to.be.true;
                });

                it("Tests the auto-refresh goes back to original state when date filter comes back to today.", function () {
                    // This test first toggles the live update off.  Then it will switch the Date from before today then back to today.
                    // The live update should still be turned off when we're back here.
                    let filterBar = wrapper.find("FilterBar").at(0);
                    filterBar.simulate("liveUpdate", false);

                    const startDate = new Date();
                    startDate.setDate(startDate.getDate() - 12);

                    const endDate = new Date();
                    endDate.setDate(endDate.getDate() - 12);

                    // get the new one when it re-renders
                    filterBar = wrapper.find(FilterBar).at(0);
                    filterBar.simulate("filterDate", new DateFilter(startDate, endDate));

                    // get the new one when it re-renders
                    filterBar = wrapper.find(FilterBar).at(0);

                    filterBar.simulate("filterDate", new DateFilter(startDate, new Date()));

                    expect(wrapper.state("tailOn")).to.be.false;
                });

                it("Tests the filterbar live update is disabled when the dates go out of range.", function () {
                    const startDate = new Date();
                    startDate.setDate(startDate.getDate() - 12);

                    const endDate = new Date();
                    endDate.setDate(endDate.getDate() - 12);

                    filterBar.simulate("filterDate", new DateFilter(startDate, endDate));

                    filterBar = wrapper.find(FilterBar).at(0);

                    expect(filterBar.prop("disableLiveUpdateCheckbox")).to.be.true;
                });
            });

            describe("Tests the auto-turn off when visibility swaps", function () {
                let visibilityWrapper: ShallowWrapper<any, any>;

                beforeEach(function () {
                    visibilityWrapper = wrapper.find(VisiblityWatcher);
                });

                it("Tests the tail turns off on visibility change.", function () {
                    visibilityWrapper.simulate("change", "hidden");

                    expect(wrapper.state("tailOn")).to.be.false;
                });

                it("Tests the tail turns on on visibility change.", function () {
                    visibilityWrapper.simulate("change", "hidden");

                    visibilityWrapper = wrapper.find(VisiblityWatcher);

                    visibilityWrapper.simulate("change", "visible");

                    expect(wrapper.state("tailOn")).to.be.true;
                });

                it("Tests that the tail stays off when it's off and we come back.", function () {
                    wrapper.setState({ tailOn: false });

                    visibilityWrapper = wrapper.find(VisiblityWatcher);

                    visibilityWrapper.simulate("change", "hidden");

                    visibilityWrapper = wrapper.find(VisiblityWatcher);

                    visibilityWrapper.simulate("change", "visible");

                    expect(wrapper.state("tailOn")).to.be.false;
                });
            });
        });
    });
});

class StubExecutor implements Interval.Executor {

    callback: () => void;
    ms: number;

    start: Sinon.SinonStub;
    end: Sinon.SinonStub;

    constructor(ms: number, callback: () => void) {
        this.callback = callback;
        this.ms = ms;
        this.start = sinon.stub();
        this.end = sinon.stub();
    }

    reset() {
        this.start.reset();
        this.end.reset();
    }
}