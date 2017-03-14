import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import { Button } from "react-toolbox/lib/button";
import Dialog from "react-toolbox/lib/dialog";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import { dummySources } from "../../utils/test";
import SourceHeader from "./SourceHeader";
import { SourceSettingsPage } from "./SourceSettingsPage";

chai.use(sinonChai);
let expect = chai.expect;

describe("Source Settings Page", function () {
    let source = dummySources(1)[0];

    let goHome: Sinon.SinonStub;
    let removeSource: Sinon.SinonStub;

    before(function () {
        goHome = sinon.stub();
        removeSource = sinon.stub();
    });

    afterEach(function () {
        goHome.reset();
        removeSource.reset();
    });

    describe("with source", function () {
        const wrapper = shallow((
            <SourceSettingsPage source={source} goHome={goHome} removeSource={removeSource} />
        ));
        const sourceHeader = wrapper.find(SourceHeader);
        it("has the source header visible", function () {
            expect(sourceHeader).to.have.length(1); // Data times are what are used to show source details.
        });
        it("sets the source on the source header", function() {
            expect(sourceHeader).to.have.prop("source", source);
        });
    });
    describe("without source", function () {
        it("does not have the source details header visibile", function () {
            const wrapper = shallow((
                <SourceSettingsPage source={undefined} goHome={goHome} removeSource={removeSource} />
            ));

            const sourceHeader = wrapper.find(SourceHeader);
            expect(sourceHeader).to.have.length(0);
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
                wrapper = shallow(<SourceSettingsPage source={source} goHome={goHome} removeSource={removeSource} />);
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

                    it("Tests the delete action called GoHome once removed.", function () {
                        console.info("CHECKING");
                        expect(goHome).to.be.calledOnce;
                    });
                });
            });
        });

        describe("Unsuccessful deletes", function () {
            before(function () {
                goHome = sinon.stub();
                removeSource = sinon.stub().returns(Promise.reject(new Error("Error per requirements of the test.")));
                wrapper = shallow(<SourceSettingsPage source={source} goHome={goHome} removeSource={removeSource} />);

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