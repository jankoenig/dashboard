import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as moment from "moment";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import { Button } from "react-toolbox/lib/button";
import Dialog from "react-toolbox/lib/dialog";

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
        let goHome: Sinon.SinonStub;
        let removeSource: Sinon.SinonStub;

        before(function () {
            getLogs = sinon.stub(LogService, "getLogs").returns(Promise.resolve(logs));
            getTimeSummary = sinon.stub(LogService, "getTimeSummary").returns(Promise.resolve(dummyTimeSummary(5)));
            getIntentSummary = sinon.stub(LogService, "getIntentSummary").returns(Promise.resolve(dummyIntentSummary(5)));
            getSourceSummary = sinon.stub(LogService, "getSourceSummary").returns(Promise.resolve(dummySourceStats()));
            goHome = sinon.stub();
            removeSource = sinon.stub();
        });

        afterEach(function () {
            getLogs.reset();
            getTimeSummary.reset();
            getIntentSummary.reset();
            getSourceSummary.reset();
            goHome.reset();
            removeSource.reset();
        });

        after(function () {
            getLogs.restore();
            getTimeSummary.restore();
            getIntentSummary.restore();
            getSourceSummary.restore();
        });

        it("Tests that the initial datastates", function () {
            const wrapper = shallow((
                <SourcePage source={source} goHome={goHome} removeSource={removeSource} />
            ));

            expect(wrapper.state("timeLoaded")).to.equal(0); // 0 = DataState.Loading
            expect(wrapper.state("intentLoaded")).to.equal(0);
            expect(wrapper.state("statsLoaded")).to.equal(0);
        });

        it("Tests that the source details header is visible when source exists.", function () {
            const wrapper = shallow((
                <SourcePage source={source} goHome={goHome} removeSource={removeSource} />
            ));

            const dataTiles = wrapper.find("DataTile");
            expect(dataTiles).to.have.length(4); // Data times are what are used to show source details.
        });

        it("Tests that the source details header is gone when source is not defined.", function () {
            const wrapper = shallow((
                <SourcePage source={undefined} goHome={goHome} removeSource={removeSource} />
            ));

            expect(wrapper.find("DataTile")).to.have.length(0);
        });

        it("Tests that the source data tiles have their correct values.", function () {
            const wrapper = shallow((
                <SourcePage source={source} goHome={goHome} removeSource={removeSource} />
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

        it("Tests that the summary view is there.", function () {
            const wrapper = shallow((
                <SourcePage source={source} goHome={goHome} removeSource={removeSource} />
            ));

            expect(wrapper.find("SummaryView")).to.have.length(1);
        });

        it("Tests that the summary view is linked to the source pages' state.", function () {
            const wrapper = shallow((<SourcePage source={source} goHome={goHome} removeSource={removeSource} />));

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
        let goHome: Sinon.SinonStub;
        let removeSource: Sinon.SinonStub;

        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            getLogs = sinon.stub(LogService, "getLogs").returns(Promise.resolve(logs));
            getTimeSummary = sinon.stub(LogService, "getTimeSummary").returns(Promise.resolve(timeSummary));
            getIntentSummary = sinon.stub(LogService, "getIntentSummary").returns(Promise.resolve(intentSummary));
            getSourceSummary = sinon.stub(LogService, "getSourceSummary").returns(Promise.resolve(sourceStats));
            goHome = sinon.stub();
            removeSource = sinon.stub();

            wrapper = shallow(<SourcePage source={undefined} goHome={goHome} removeSource={removeSource} />);
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

    describe("Delete source", function () {
        let goHome: Sinon.SinonStub;
        let removeSource: Sinon.SinonStub;
        let wrapper: ShallowWrapper<any, any>;

        describe("Successful deletes", function () {
            beforeEach(function () {
                goHome = sinon.stub();
                removeSource = sinon.stub().returns(Promise.resolve(source));
                wrapper = shallow(<SourcePage source={source} goHome={goHome} removeSource={removeSource} />);
            });

            it("Tests the dialog is opened.", function () {
                wrapper.find(Button).at(0).simulate("click");

                expect(wrapper.state("deleteDialogActive")).to.be.true;

                const dialog = wrapper.find(Dialog);
                expect(dialog.prop("active")).to.be.true;
            });

            describe("Dialog", function () {
                let dialog: ShallowWrapper<any, any>;
                let actions: any[];

                beforeEach(function () {
                    // Act like we just opened it.
                    wrapper.find(Button).at(0).simulate("click");

                    dialog = wrapper.find(Dialog).at(0);
                    actions = dialog.prop("actions");
                });

                it("Tests the first action is proper.", function () {
                    const action = actions[0];

                    // first one is the cancel action.
                    expect(action.label).to.equal("Cancel");
                    expect(action.onClick).to.exist;
                });

                it("Tests the second action is proper.", function () {
                    const action = actions[1];

                    // second one is the delete action.
                    expect(action.label).to.equal("Delete");
                    expect(action.onClick).to.exist;
                });

                describe("First Action", function () {
                    beforeEach(function () {
                        const action = actions[0];
                        action.onClick();
                    });

                    it("Tests the first action performed its duties.", function () {
                        expect(wrapper.state("deleteDialogActive")).to.be.false;
                    });
                });

                describe("Second Action", function () {
                    beforeEach(function () {
                        const action = actions[1];
                        return action.onClick(); // This action returns a Promise just for this test.
                    });

                    it("Tests the delete action called remove source..", function () {
                        expect(removeSource).to.have.been.calledOnce;
                        expect(removeSource).to.have.been.calledWith(source);
                    });

                    it("Tests the delete action called GoHome once removed.", function() {
                        expect(goHome).to.be.calledOnce;
                    });
                });
            });
        });

        describe("Unsuccessful deletes", function () {
            before(function () {
                goHome = sinon.stub();
                removeSource = sinon.stub().returns(Promise.reject(new Error("Error per requirements of the test.")));
                wrapper = shallow(<SourcePage source={source} goHome={goHome} removeSource={removeSource} />);

                const actions = wrapper.find(Dialog).at(0).prop("actions");
                const deleteAction = actions[1];
                return deleteAction.onClick();
            });

            it("Tests the GoHome method is not called on failed delete.", function () {
                expect(goHome).to.not.be.called;
            });
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