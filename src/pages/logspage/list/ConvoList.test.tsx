import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import List from "../../../components/List/List";
import ConversationList from "../../../models/conversation-list";
import Log from "../../../models/log";
import { dummyLogs } from "../../../utils/test";
import ConvoList, { ConvoListProps, ConvoListState } from "./ConvoList";

// Setup chai with sinon-chai
chai.use(sinonChai);
let expect = chai.expect;

describe("ConvoList", function () {

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
            const wrapper = shallow(<ConvoList conversations={conversations} onClick={onClick} onEmpty={noLogsRenderer} />);

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
                    <ConvoList
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
            const wrapper = shallow(<ConvoList conversations={new ConversationList()} onClick={onClick} onEmpty={noLogsRenderer} />);

            expect(wrapper.find("ReactList")).to.have.length(0);
            expect(wrapper.find("p")).to.have.length(1);
            expect(noLogsRenderer).to.be.calledOnce;
        });
    });

    describe("property expandListItemWhenActive", function () {

        // jsdom(); // required by enzyme mount, mocks the entire dom

        let logs = dummyLogs(4);
        let conversations = ConversationList.fromLogs(logs);

        let onClick: Sinon.SinonSpy;
        let wrapper: ShallowWrapper<ConvoListProps, ConvoListState>;

        describe("when true", function () {

            before(function() {
                onClick = sinon.stub();
            });

            beforeEach(function () {
                noLogsRenderer.reset();

                wrapper = shallow((
                    <ConvoList
                        conversations={conversations}
                        onClick={onClick}
                        expandListItemWhenActive={true}
                        onEmpty={noLogsRenderer} />
                )) as ShallowWrapper<ConvoListProps, ConvoListState>;
            });

            afterEach(function() {
                onClick.reset();
            });

            it("renders interaction after clicking a list item", function () {
                // It doesn't render a list item, so we're just going to go straight to a click item.
                (wrapper.instance() as ConvoList).handleClick(conversations[0]);

                expect(onClick).to.have.been.calledOnce;

                let listItem = (wrapper.instance() as ConvoList).renderItem(0, conversations[0].id);
                expect(listItem.props["active"]).to.be.true;
            });

            it("clears the interaction when it is clicked again", function () {
                // It doesn't render a list item, so we're just going to go straight to a click item.
                (wrapper.instance() as ConvoList).handleClick(conversations[0]);
                (wrapper.instance() as ConvoList).handleClick(conversations[0]);

                let listItem = (wrapper.instance() as ConvoList).renderItem(0, conversations[0].id);
                expect(onClick).to.have.callCount(2);
                expect(listItem.props["active"]).to.be.false;
            });

            it("renders two interactions after clicking on two list items", function () {
                // It doesn't render a list item, so we're just going to go straight to a click item.
                (wrapper.instance() as ConvoList).handleClick(conversations[0]);
                (wrapper.instance() as ConvoList).handleClick(conversations[1]);

                let listItemOne = (wrapper.instance() as ConvoList).renderItem(0, conversations[0].id);
                let listItemTwo = (wrapper.instance() as ConvoList).renderItem(0, conversations[1].id);

                expect(listItemOne.props["active"]).to.be.true;
                expect(listItemTwo.props["active"]).to.be.true;
            });
        });

        describe("when false", function () {
            beforeEach(function () {
                onClick = sinon.spy();

                wrapper = shallow((
                    <ConvoList
                        conversations={conversations}
                        onClick={onClick} />
                )) as ShallowWrapper<ConvoListProps, ConvoListState>;
            });

            it("does not render the interaction when clicked", function () {
                (wrapper.instance() as ConvoList).handleClick(conversations[0]);
                expect(onClick).to.have.been.calledOnce;

                // Now we should find a Interaction present
                expect(wrapper.find("Interaction")).to.have.length(0);
            });
        });
    });
});