import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as moment from "moment";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import LogService from "../services/log";
import { dummyLogs, dummySources } from "../utils/test";
import { SourcePage } from "./SourcePage";

chai.use(sinonChai);
let expect = chai.expect;

const createdAtFormat = "MMM Do, YYYY";

describe("Source Page", function () {
    let logs = dummyLogs(10);
    let source = dummySources(1)[0];

    describe("Initial load", function () {
        let getLogs: Sinon.SinonStub;
        let getTimeSummary: Sinon.SinonStub;
        let getIntentSummary: Sinon.SinonStub;
        let getSourceSummary: Sinon.SinonStub;

        before(function () {
            getLogs = sinon.stub(LogService, "getLogs").returns(Promise.resolve(logs));
            getTimeSummary = sinon.stub(LogService, "getTimeSummary").returns(Promise.resolve(dummyTimeSummary(5)));
            getIntentSummary = sinon.stub(LogService, "getIntentSummary").returns(Promise.resolve(dummyIntentSummary(5)));
            getSourceSummary = sinon.stub(LogService, "getSourceSummary").returns(Promise.resolve(dummySourceStats()));
        });

        afterEach(function () {
            getLogs.reset();
            getTimeSummary.reset();
            getIntentSummary.reset();
            getSourceSummary.reset();
        });

        after(function () {
            getLogs.restore();
            getTimeSummary.restore();
            getIntentSummary.restore();
            getSourceSummary.restore();
        });

        it("Tests that the initial datastates", function () {
            const wrapper = shallow((
                <SourcePage source={source} />
            ));

            expect(wrapper.state("timeLoaded")).to.equal(0); // 0 = DataState.Loading
            expect(wrapper.state("intentLoaded")).to.equal(0);
            expect(wrapper.state("statsLoaded")).to.equal(0);
        });

        it("Tests that the source details header is visible when source exists.", function () {
            const wrapper = shallow((
                <SourcePage source={source} />
            ));

            const dataTiles = wrapper.find("DataTile");
            expect(dataTiles).to.have.length(4); // Data times are what are used to show source details.
        });

        it("Tests that the source details header is gone when source is not defined.", function () {
            const wrapper = shallow((
                <SourcePage source={undefined} />
            ));

            expect(wrapper.find("DataTile")).to.have.length(0);
        });

        it("Tests that the source data tiles have their correct values.", function () {
            const wrapper = shallow((
                <SourcePage source={source} />
            ));

            const dataTiles = wrapper.find("DataTile");

            let dataTile = dataTiles.at(0);
            expect(dataTile.prop("value")).to.equal(source.name);

            dataTile = dataTiles.at(1);
            expect(dataTile.prop("value")).to.equal(source.id);

            dataTile = dataTiles.at(2);
            expect(dataTile.prop("value")).to.equal(moment(source.created).format(createdAtFormat));

            dataTile = dataTiles.at(3);
            expect(dataTile.prop("value")).to.equal(source.secretKey);
            expect(dataTile.prop("hidden")).to.equal(true);
            expect(dataTile.prop("showable")).to.equal(true);
        });

        it ("Tests that the summary view is there.", function() {
            const wrapper = shallow((
                <SourcePage source={source} />
            ));

            expect(wrapper.find("SummaryView")).to.have.length(1);
        });

        it ("Tests that the summary view is linked to the source pages' state.", function() {
            const wrapper = shallow((<SourcePage source={source} />));

            const summaryView = wrapper.find("SummaryView").at(0);
            expect(summaryView.prop("timeData")).to.equal(wrapper.state("timeSummaryData"));
            expect(summaryView.prop("intentData")).to.equal(wrapper.state("intentSummaryData"));
            expect(summaryView.prop("timeLoaded")).to.equal(wrapper.state("timeLoaded"));
            expect(summaryView.prop("intentLoaded")).to.equal(wrapper.state("intentLoaded"));
            expect(summaryView.prop("statsLoaded")).to.equal(wrapper.state("statsLoaded"));

            const stats = wrapper.state("sourceStats").stats;

            expect(summaryView.prop("totalEvents")).to.equal(stats.totalEvents);
            expect(summaryView.prop("totalUniqueUsers")).to.equal(stats.totalUsers);
            expect(summaryView.prop("totalExceptions")).to.equal(stats.totalExceptions);
        });
    });

    describe("Logs loaded.", function () {
        const timeSummary = dummyTimeSummary(5);
        const intentSummary = dummyIntentSummary(5);
        const sourceStats = dummySourceStats();

        let getLogs: Sinon.SinonStub;
        let getTimeSummary: Sinon.SinonStub;
        let getIntentSummary: Sinon.SinonStub;
        let getSourceSummary: Sinon.SinonStub;

        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            getLogs = sinon.stub(LogService, "getLogs").returns(Promise.resolve(logs));
            getTimeSummary = sinon.stub(LogService, "getTimeSummary").returns(Promise.resolve(timeSummary));
            getIntentSummary = sinon.stub(LogService, "getIntentSummary").returns(Promise.resolve(intentSummary));
            getSourceSummary = sinon.stub(LogService, "getSourceSummary").returns(Promise.resolve(sourceStats));

            wrapper = shallow(<SourcePage source={undefined} />);
            wrapper.setProps({
                source: source
            });
            wrapper.update();
        });

        after(function () {
            getLogs.restore();
            getTimeSummary.restore();
            getIntentSummary.restore();
            getSourceSummary.restore();
        });

        it("Tests that the get Time summary is called on props set.", function () {
            expect(getTimeSummary).to.have.been.calledOnce;
        });

        it("Tests that the time summary data state is correct.", function () {
            expect(wrapper.state("timeLoaded")).to.equal(2); // 2 === DataState.Loaded
        });

        it("Tests that the time summary data is correct", function () {
            const timeData: any[] = wrapper.state("timeSummaryData");
            const timeBuckets: LogService.TimeBucket[] = timeSummary.buckets;
            expect(timeData).to.have.length(timeBuckets.length);

            for (let i = 0; i < timeData.length; ++i) {
                expect(timeData[i].date).to.equalDate(new Date(timeBuckets[i].date));
                expect(timeData[i].time).to.equal(new Date(timeBuckets[i].date).getTime());
                expect(timeData[i].count).to.equal(timeBuckets[i].count);
            }
        });

        it("Tests that the get Intent summary is called on props set.", function () {
            expect(getIntentSummary).to.have.been.calledOnce;
        });

        it("Tests that the intent summary data state is correct.", function () {
            expect(wrapper.state("intentLoaded")).to.equal(2); // 2 === DataState.Loaded
        });

        it("Tests that the intent summary data is correct", function () {
            const intentData: any[] = wrapper.state("intentSummaryData");
            const intentBuckets: LogService.IntentBucket[] = intentSummary.count;

            expect(intentData).to.have.length(intentBuckets.length);

            for (let i = 0; i < intentData.length; ++i) {
                expect(intentData[i].title).to.equal(intentBuckets[i].name);
                expect(intentData[i].count).to.equal(intentBuckets[i].count);
            }
        });

        it("Tests that the source stats is called on props set.", function () {
            expect(getSourceSummary).to.have.been.calledOnce;
        });

        it("Tests that the source stats data state is correct.", function () {
            expect(wrapper.state("statsLoaded")).to.equal(2); // 2 === DataState.Loaded
        });

        it("Tests that the source stats data is correct", function () {
            const pageStats: any = wrapper.state("sourceStats");
            const originalStats: LogService.SourceStats = sourceStats;

            expect(pageStats).to.equal(originalStats);
        });
    });
});

function dummyTimeSummary(size: number): LogService.TimeSummary {
    return {
        buckets: dummyTimeBuckets(size)
    };
}

function dummyIntentSummary(size: number): LogService.IntentSummary {
    return {
        count: dummyIntentBuckets(size)
    };
}

function dummySourceStats(): LogService.SourceStats {
    return {
        source: randomNameGenerator(),
        stats: {
            totalUsers: 1000,
            totalEvents: 2000,
            totalExceptions: 5 // Don't want to go crazy here.
        }
    };
}

function dummyTimeBuckets(size: number): LogService.TimeBucket[] {
    let buckets: LogService.TimeBucket[] = [];

    let date: Date = new Date();
    for (let i = 0; i < size; ++i) {
        buckets.push({
            date: date.toISOString(),
            count: i
        });
        if (i % 5 === 0) {
            date.setDate(date.getDate() - 1);
        }
    }

    return buckets;
}

function dummyIntentBuckets(size: number): LogService.IntentBucket[] {
    let buckets: LogService.IntentBucket[] = [];

    for (let i = 0; i < size; ++i) {
        buckets.push({
            name: randomNameGenerator(),
            count: i
        });
    }

    return buckets;
}

function randomNameGenerator(): string {
    let name: string = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 5; ++i) {
        name += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return name;
}