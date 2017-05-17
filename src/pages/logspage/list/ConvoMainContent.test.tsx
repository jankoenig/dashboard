import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";

import AudioComponent from "../../../components/Audio/AudioComponent";
import Conversation, { createConvo } from "../../../models/conversation";
import { alexaJustTextResponseLog, alexaRequestIntentLog, alexaResponseLog, alexaSsmlWithAudioResponseLog, alexaWithAudioPlyIntentResponseLog, audioTestUrl } from "../../../utils/test";
import ConvoIcon from "./ConvoIcon";
import ConvoMainContent from "./ConvoMainContent";
import TimeTextComponent from "./ConvoTimeTextComponent";

const expect = chai.expect;

const primaryStyle = {
    width: "100px",
    height: "200px"
};

const subtitleStyle = {
    width: "200px",
    height: "300px"

};

const textStyle = {
    width: "200px",
    height: "300px"

};

const iconStyle = {
    width: "300px",
    height: "400px"
};

describe("ConvoMainContent", function () {
    let conversation: Conversation;
    let conversationJustText: Conversation;
    let conversationSsmlWithAudio: Conversation;
    let conversationWithAudioPlayIntent: Conversation;

    before(function () {
        conversation = createConvo({ request: alexaRequestIntentLog(), response: alexaResponseLog() });
        conversationJustText = createConvo({request: alexaRequestIntentLog(), response: alexaJustTextResponseLog()});
        conversationSsmlWithAudio = createConvo({request: alexaRequestIntentLog(), response: alexaSsmlWithAudioResponseLog()});
        conversationWithAudioPlayIntent = createConvo({request: alexaRequestIntentLog(), response: alexaWithAudioPlyIntentResponseLog()});
    });

    describe("Render", function () {
        let wrapper: ShallowWrapper<any, any>;

        describe("Defaults", function () {
            before(function () {
                wrapper = shallow(<ConvoMainContent
                    conversation={conversation}
                />);
            });

            it("Tests the default style for primary component", function () {
                expect(wrapper.find("span").at(0).prop("style")).to.deep.equal(ConvoMainContent.primaryContentStyle);
            });

            it("Tests the default style for right part of primary component", function () {
                expect(wrapper.find("div").at(0).prop("style")).to.deep.equal(ConvoMainContent.rightContentStyle);
            });

            it("Tests the default style for icon", function () {
                expect(wrapper.find(ConvoIcon).at(0).prop("style")).to.deep.equal(ConvoMainContent.iconStyle);
            });

            it("Tests the default style for subtitle", function () {
                expect(wrapper.find(TimeTextComponent).at(0).prop("style")).to.deep.equal(ConvoMainContent.subtitleStyle);
            });

            it("Tests the default style for text on right part of primary component", function () {
                expect(wrapper.find("span").at(2).prop("style")).to.deep.equal(ConvoMainContent.textContentStyle);
            });

            describe("Icon", function () {
                it("Tests it contains the icon is displayed.", function () {
                    expect(wrapper.find(ConvoIcon)).to.have.length(1);
                });

                it("Tests the props are passed down.", function () {
                    const iconWrapper = wrapper.find(ConvoIcon).at(0);

                    expect(iconWrapper).to.have.prop("origin", conversation.origin);
                    expect(iconWrapper).to.have.prop("color", conversation.userColors.fill);
                });
            });

            describe("Intent text", function () {
                it("Tests that the conversation subtitle text is displayed.", function () {
                    const intentWrapper = wrapper.find("span").at(1);

                    expect(intentWrapper).to.have.text(conversation.requestPayloadType);
                });
            });

            describe("outputSpeech text", function(){
              it("Tests that the conversation response text doesn't get rendered when no text is available", function(){
                const outputSpeechTextWrapper = wrapper.find("span").at(2);

                expect(outputSpeechTextWrapper.text()).to.not.equal(`"${conversation.outputSpeechText}"`);
              });
            });

            describe("outputSpeech ssml", function(){
              it("Tests that the conversation response ssml is displayed when available", function(){
                const outputSpeechSsmlWrapper = wrapper.find("span").at(2);

                expect(outputSpeechSsmlWrapper).not.to.be.undefined;
                expect(outputSpeechSsmlWrapper.text()).to.equal(`"${conversation.ssmlText}"`);
              });
            });

            describe("outputSpeech audio", function(){
              it("Tests that the conversation response ssml audio is not displayed when not available", function(){
                expect(wrapper.find(AudioComponent)).to.have.length(0);
              });

              it("Tests that the conversation response ssml audio is displayed when available for play intent", function(){
                conversation.response.payload.response.directives = [{audioItem: {stream: {url: audioTestUrl}}}];
                expect(wrapper.find("div")).to.have.length(1);
              });
            });

            describe("TimeTextComponent", function () {
                it("Tests that the TimeTextComponent is displayed.", function () {
                    expect(wrapper.find(TimeTextComponent)).to.have.length(1);
                });

                it("Tests that the TiemTextComponent has good props.", function () {
                    const timeWrapper = wrapper.find(TimeTextComponent).at(0);

                    expect(timeWrapper).has.prop("timestamp", conversation.timestamp);
                });
            });
        });

        describe("without ssml, just text on the response", function() {
          before(function () {
            wrapper = shallow(<ConvoMainContent
              conversation={conversationJustText}
            />);
          });
          it("Tests that the conversation response text is displayed when available.", function () {
            const outputSpeechTextWrapper = wrapper.find("span").at(2);

            expect(outputSpeechTextWrapper.text()).to.equal(`"${conversationJustText.outputSpeechText}"`);
          });

          it("Tests that the conversation response ssml is not displayed when not available", function(){
            const outputSpeechSsmlWrapper = wrapper.find("span").at(2);

            expect(outputSpeechSsmlWrapper.text()).to.not.equal(`"${conversationJustText.ssmlText}"`);
          });
        });

        describe("with audio file on ssml", function() {
          before(function () {
            wrapper = shallow(<ConvoMainContent
              conversation={conversationSsmlWithAudio}
            />);
          });
          it("Tests that the conversation response ssml audio is displayed when available", function(){
            expect(wrapper.find(AudioComponent)).to.have.length(1);
          });
        });

        describe("with audio file on play intent", function() {
          before(function () {
            wrapper = shallow(<ConvoMainContent
              conversation={conversationWithAudioPlayIntent}
            />);
          });
          it("Tests that the conversation response ssml audio is displayed when available", function(){
            expect(wrapper.find(AudioComponent)).to.have.length(1);
          });
        });

        describe("Styles", function () {
            before(function () {
                wrapper = shallow(
                    <ConvoMainContent
                        conversation={conversation}
                        iconStyle={iconStyle}
                        subtitleStyle={subtitleStyle}
                        primaryContentStyle={primaryStyle}
                        textContentStyle={textStyle} />
                );
            });

            it("Tests the primary style was applied.", function () {
                const combindStyle = { ...ConvoMainContent.primaryContentStyle, ...primaryStyle };
                let primaryWrapper = wrapper.find("span").at(0);
                expect(primaryWrapper.prop("style")).to.deep.equal(combindStyle);
            });

            it("Tests the subtitle style was applied.", function () {
                const combindStyle = { ...ConvoMainContent.subtitleStyle, ...subtitleStyle };
                let subtitleWrapper = wrapper.find(TimeTextComponent).at(0);
                expect(subtitleWrapper.prop("style")).to.deep.equal(combindStyle);
            });

            it("Tests the outputSpeech text style was applied.", function () {
                const combindStyle = { ...ConvoMainContent.textContentStyle, ...textStyle };
                let outputSpeechTextWrapper = wrapper.find("span").at(2);
                expect(outputSpeechTextWrapper.prop("style")).to.deep.equal(combindStyle);
            });

            it("Tests the icon style was applied.", function () {
                const combindStyle = { ...ConvoMainContent.iconStyle, ...iconStyle };
                let iconWrapper = wrapper.find(ConvoIcon).at(0);
                expect(iconWrapper.prop("style")).to.deep.equal(combindStyle);
            });
        });
    });
});
