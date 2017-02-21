import * as chai from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import Log from "../../models/log";
import LogQuery from "../../models/log-query";
import Source from "../../models/source";
import { LogMap, LogQueryEvent } from "../../reducers/log";
import LogsExplorer from "./LogsExplorer";
import { LogsPage } from "./LogsPage";

import { dummyLogs, dummySources } from "../../utils/test";

chai.use(sinonChai);
let expect = chai.expect;

describe("LogsPage", function () {

    it("renders a LogsExplorer", function () {
        const getLogs = sinon.stub().returns(dummyLogs(4));
        const nextpage = sinon.stub().returns(dummyLogs(4));
        const refresh = sinon.stub().returns(dummyLogs(4));

        let wrapper = shallow(<LogsPage isLoading source={undefined} logMap={undefined} getLogs={getLogs} newPage={nextpage} refresh={refresh} />);
        expect(wrapper.find(LogsExplorer)).to.have.length(1);
    });

    describe("Paging", function () {
        let source: Source = dummySources(1)[0];
        let allPages: Log[] = dummyLogs(20);
        let firstPage: Log[] = allPages.slice(5, 15);

        let logMap: LogMap = {};
        logMap[source.id] = {
            logs: firstPage,
            query: new LogQuery({ source: source, startTime: daysAgo(5), endTime: daysAgo(1) })
        };

        let getLogs: Sinon.SinonStub;
        let nextPage: Sinon.SinonStub;
        let refresh: Sinon.SinonStub;

        before(function () {
            getLogs = sinon.stub();
            getLogs.returns(Promise.resolve(dummyLogs(0)));

            nextPage = sinon.stub();
            // "nextPage" returns the first along with the second appended on top.
            nextPage.onFirstCall().returns(Promise.resolve({ newLogs: allPages.slice(15), oldLogs: firstPage, totalLogs: allPages.slice(5) }))
                .onSecondCall().returns(Promise.resolve({ newLogs: dummyLogs(0), oldLogs: allPages.slice(5), totalLogs: allPages.slice(5) }))
                .onThirdCall().returns(Promise.resolve({ newLogs: dummyLogs(0), oldLogs: allPages.slice(5), totalLogs: allPages.slice(5) }))
                .onCall(4).returns(Promise.resolve({ newLogs: dummyLogs(0), oldLogs: allPages.slice(5), totalLogs: allPages.slice(5) }))
                .onCall(5).returns(Promise.resolve({ newLogs: dummyLogs(0), oldLogs: allPages.slice(5), totalLogs: allPages.slice(5) }))
                .onCall(6).returns(Promise.resolve({ newLogs: dummyLogs(0), oldLogs: allPages.slice(5), totalLogs: allPages.slice(5) }));

            refresh = sinon.stub();
            // "refresh" returns all old items along with the new items preppended before it.
            refresh.returned(Promise.resolve(allPages.slice(0, 15)));
        });

        afterEach(function () {
            getLogs.reset();
            nextPage.reset();
        });

        it("Tests that new logs are retrieved when user scrolls to bottom.", function () {
            let wrapper = shallow(<LogsPage isLoading={false} source={source} logMap={logMap} getLogs={getLogs} newPage={nextPage} refresh={refresh} />);

            const logExplorer = wrapper.find("LogExplorer").at(0);

            logExplorer.simulate("scroll", 0, 10, firstPage.length);

            expect(nextPage).to.have.been.calledOnce;

            // Checking the query start and end times are where they should be.

            const logQueryEvent: LogQueryEvent = nextPage.args[0][0];
            const limit: number = nextPage.args[0][1];

            const originalLogQueryEvent = logMap[source.id];

            expect(limit).to.equal(50); // Current limit is 50 in the class.

            // It requests everything from the first filter up to the last item in the page.
            expect(logQueryEvent).to.deep.equal(originalLogQueryEvent);
        });

        it("Tests that the get logs is not retrieved when not within range.", function () {
            let wrapper = shallow(<LogsPage isLoading={false} source={source} logMap={logMap} getLogs={getLogs} newPage={nextPage} refresh={refresh} />);

            const logExplorer = wrapper.find("LogExplorer").at(0);

            logExplorer.simulate("scroll", 0, 3, firstPage.length);

            expect(nextPage).to.not.have.been.called;
        });

        it("Tests that the get logs is not retrieved when already loading.", function () {
            let wrapper = shallow(<LogsPage isLoading={true} source={source} logMap={logMap} getLogs={getLogs} newPage={nextPage} refresh={refresh} />);

            const logExplorer = wrapper.find("LogExplorer").at(0);

            logExplorer.simulate("scroll", 0, 10, firstPage.length);

            expect(nextPage).to.not.have.been.called;
        });

        it("Tests that the get logs is not retrieved when nothing was sent last time.", function () {
            let wrapper = shallow(<LogsPage isLoading={false} source={source} logMap={logMap} getLogs={getLogs} newPage={nextPage} refresh={refresh} />);

            // Everything works through a Promise, so by doing this, you let all the Promises that are in queue execute first.
            // Then the next goes.  Then the next and so on.  Everything waits until it's necessary.
            return Promise.resolve(true)
            .then(() => {
                let logExplorer = wrapper.find("LogExplorer").at(0);

                logExplorer.simulate("scroll", 0, 10, firstPage.length);
            }).then(() => {
                let logExplorer = wrapper.find("LogExplorer").at(0);

                logExplorer.simulate("scroll", 0, 10, firstPage.length);
            }).then(() => {
                let logExplorer = wrapper.find("LogExplorer").at(0);

                logExplorer.simulate("scroll", 0, 10, firstPage.length);
            }).then(() => {
                let logExplorer = wrapper.find("LogExplorer").at(0);

                logExplorer.simulate("scroll", 0, 10, firstPage.length);
            }).then(() => {
                let logExplorer = wrapper.find("LogExplorer").at(0);

                logExplorer.simulate("scroll", 0, 10, firstPage.length);
            }).then(() => {
                expect(nextPage).to.have.been.calledTwice;  // Gets the first page, then nothing the second time, then should not try again after.
            });
        });
    });
});

function daysAgo(num: number): Date {
    const date: Date = new Date();
    date.setDate(date.getDate() - num);
    return date;
}