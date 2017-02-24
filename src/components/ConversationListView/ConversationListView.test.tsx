import * as chai from "chai";
import { mount, ReactWrapper, shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";
let jsdom = require("mocha-jsdom");

import List from "../../components/List/List";
import ConversationList from "../../models/conversation-list";
import Log from "../../models/log";
import { dummyLogs } from "../../utils/test";
import ConversationListView, { ConversationListViewProps, ConversationListViewState } from "./ConversationListView";

// Setup chai with sinon-chai
chai.use(sinonChai);
let expect = chai.expect;

describe("ConversationListView", function () {

    let noLogsRenderer: Sinon.SinonStub;

    beforeEach(function () {
        noLogsRenderer = sinon.stub().returns((<p> No Logs Found </p>));
    });

    describe("with logs", function () {
        beforeEach(function () {
            noLogsRenderer.reset();
        });

        it("renders correctly", function () {
            let logs = dummyLogs(4);
            let conversations = ConversationList.fromLogs(logs);
            let onClick = sinon.spy();
            const wrapper = shallow(<ConversationListView conversations={conversations} onClick={onClick} onEmpty={noLogsRenderer} />);

            expect(wrapper.find("StaticList")).to.have.length(1);
            expect(wrapper.find("div")).to.have.length(0);
        });

        describe("Handles scroll", function () {
            let wrapper: ShallowWrapper<any, any>;
            let logs: Log[];
            let conversations: ConversationList;
            let onClick: Sinon.SinonSpy;
            let onScroll: Sinon.SinonSpy;

            before(function () {
                logs = dummyLogs(4);
                conversations = ConversationList.fromLogs(logs);
                onClick = sinon.spy();
                onScroll = sinon.spy();
            });

            beforeEach(function () {
                wrapper = shallow(
                    <ConversationListView
                        conversations={conversations}
                        onScroll={onScroll}
                        onClick={onClick}
                        onEmpty={noLogsRenderer} />
                );
            });

            afterEach(function () {
                onClick.reset();
                onScroll.reset();
            });

            it("Tests the items are passed up.", function () {
                const listWrapper = wrapper.find(List);

                listWrapper.simulate("scroll", 1, 5, 10);

                expect(onScroll).to.be.calledWith(1, 5, 10);
            });

            it("Tests the default first index", function () {
                const listWrapper = wrapper.find(List);

                listWrapper.simulate("scroll", undefined, 5, 10);

                expect(onScroll).to.be.calledWith(0, 5, 10);
            });

            it("Tests the default last index", function () {
                const listWrapper = wrapper.find(List);

                listWrapper.simulate("scroll", 1, undefined, 10);

                expect(onScroll).to.be.calledWith(1, 10, 10);
            });
        });
    });
    describe("without logs", function () {

        beforeEach(function () {
            noLogsRenderer.reset();
        });

        it("renders correctly", function () {
            let onClick = sinon.spy();
            const wrapper = shallow(<ConversationListView conversations={new ConversationList()} onClick={onClick} onEmpty={noLogsRenderer} />);

            expect(wrapper.find("ReactList")).to.have.length(0);
            expect(wrapper.find("p")).to.have.length(1);
            expect(noLogsRenderer).to.be.calledOnce;
        });
    });
    describe("property expandListItemWhenActive", function () {

        jsdom(); // required by enzyme mount, mocks the entire dom

        let logs = dummyLogs(4);
        let conversations = ConversationList.fromLogs(logs);

        let onClick: Sinon.SinonSpy;
        let wrapper: ReactWrapper<ConversationListViewProps, ConversationListViewState>;

        describe("when true", function () {

            beforeEach(function () {
                onClick = sinon.spy();
                noLogsRenderer.reset();

                wrapper = mount((
                    <ConversationListView
                        conversations={conversations}
                        onClick={onClick}
                        expandListItemWhenActive={true}
                        onEmpty={noLogsRenderer} />
                ));

                expect(wrapper.find("ConversationListViewItem")).to.have.length(2);
                expect(wrapper.find("Interaction")).to.have.length(0);
            });

            it("renders interaction after clicking a list item", function () {

                let listItem = wrapper.find("li div").first();
                listItem.simulate("click");
                expect(onClick).to.have.been.calledOnce;

                // Now we should find a Interaction present
                expect(wrapper.find("Interaction")).to.have.length(1);
            });
            it("clears the interaction when it is clicked again", function () {
                let listItem = wrapper.find("li div").first();
                listItem.simulate("click");
                expect(onClick).to.have.been.calledOnce;
                listItem.simulate("click"); // click again to disable
                expect(onClick).to.have.callCount(2);
                expect(wrapper.find("Interaction")).to.have.length(0);
            });
            it("renders two interactions after clicking on two list items", function () {
                let listItems = wrapper.find("li div");
                let listItemOne = listItems.first();
                let listItemTwo = listItems.last();

                listItemOne.simulate("click");
                listItemTwo.simulate("click");

                expect(wrapper.find("Interaction")).to.have.length(2);
            });
        });
        describe("when false", function () {
            beforeEach(function () {
                onClick = sinon.spy();

                wrapper = mount((
                    <ConversationListView
                        conversations={conversations}
                        onClick={onClick} />
                ));

                expect(wrapper.find("ConversationListViewItem")).to.have.length(2);
                expect(wrapper.find("Interaction")).to.have.length(0);
            });
            it("does not render the interaction when clicked", function () {
                let listItem = wrapper.find("li div").first();
                listItem.simulate("click");
                expect(onClick).to.have.been.calledOnce;

                // Now we should find a Interaction present
                expect(wrapper.find("Interaction")).to.have.length(0);
            });
        });
    });
});