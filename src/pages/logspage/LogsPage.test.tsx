import * as chai from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import Log from "../../models/log";
import LogQuery from "../../models/log-query";
import Source from "../../models/source";
import { LogMap } from "../../reducers/log";
import LogsExplorer from "./LogsExplorer";
import { LogsPage } from "./LogsPage";

import { dummyLogs, dummySources } from "../../utils/test";

chai.use(sinonChai);
let expect = chai.expect;

describe("LogsPage", function () {

    it("renders a LogsExplorer", function () {
        const getLogs = sinon.stub().returns(dummyLogs(4));

        let wrapper = shallow(<LogsPage isLoading source={undefined} logMap={undefined} getLogs={getLogs} />);
        expect(wrapper.find(LogsExplorer)).to.have.length(1);
    });

    describe("Paging", function () {
        let source: Source = dummySources(1)[0];
        let firstPage: Log[] = dummyLogs(10);
        let secondPage: Log[] = dummyLogs(5);

        let logMap: LogMap = {};
        logMap[source.id] = {
            logs: firstPage,
            query: new LogQuery({ source: source, startTime: daysAgo(5), endTime: daysAgo(1) })
        };

        let getLogs: Sinon.SinonStub;

        before(function () {
            getLogs = sinon.stub().returns(Promise.resolve(secondPage));
        });

        afterEach(function () {
            getLogs.reset();
        });

        it("Tests that new logs are retrieved when user scrolls to bottom.", function () {
            let wrapper = shallow(<LogsPage isLoading={false} source={source} logMap={logMap} getLogs={getLogs} />);

            const logExplorer = wrapper.find("LogExplorer").at(0);

            logExplorer.simulate("scroll", 0, 10, firstPage.length);

            expect(getLogs).to.have.been.calledOnce;

            // Checking the query start and end times are where they should be.

            const logQuery: LogQuery = getLogs.args[0][0];
            const append: boolean = getLogs.args[0][1];

            expect(append).to.be.true; // Since it's scrolling, it should add to the new ones rather than replace.

            // It requests everything from the first filter up to the last item in the page.
            expect(logQuery.source).to.equal(source);
            expect(logQuery.startTime).to.equalDate(logQuery.startTime);
            expect(logQuery.endTime).to.be.equalDate(firstPage[firstPage.length - 1].timestamp);
        });

        it("Tests that the get logs is not retrieved when not within range.", function () {
            let wrapper = shallow(<LogsPage isLoading={false} source={source} logMap={logMap} getLogs={getLogs} />);

            const logExplorer = wrapper.find("LogExplorer").at(0);

            logExplorer.simulate("scroll", 0, 3, firstPage.length);

            expect(getLogs).to.not.have.been.called;
        });

        it("Tests that the get logs is not retrieved when already loading.", function () {
            let wrapper = shallow(<LogsPage isLoading={true} source={source} logMap={logMap} getLogs={getLogs} />);

            const logExplorer = wrapper.find("LogExplorer").at(0);

            logExplorer.simulate("scroll", 0, 10, firstPage.length);

            expect(getLogs).to.not.have.been.called;
        });
    });
});

function daysAgo(num: number): Date {
    const date: Date = new Date();
    date.setDate(date.getDate() - num);
    return date;
}