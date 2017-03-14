import { expect } from "chai";

import { removeAudio, storeAudio } from "../actions/audio";
import { audio } from "./audio";

describe("Audio Reducer", function () {
    describe("sets the initial state", function () {
        let state = audio(undefined, { type: "" });
        it("sets the audio map", function () {
            expect(state.audio).to.exist;
        });
    });
    describe("stores audio action", function () {
        let state = audio(undefined, { type: "" });

        let audioElement = new Audio("https://audio.url");
        audioElement.id = "helloId";

        let nextState = audio(state, storeAudio(audioElement));
        it("sets the audio on the store", function () {
            expect(nextState.audio).to.exist;
            let keys = Object.keys(nextState.audio);
            expect(keys).to.have.length(1);
            expect(nextState.audio[keys[0]]).to.equal(audioElement);
        });
    });
    describe("removes the audio action", function() {
        let state = audio(undefined, { type: "" });

        let audioElement = new Audio("https://audio.url");
        audioElement.id = "helloId";

        // setup the test by adding a key
        state.audio["key"] = audioElement;

        let nextState = audio(state, removeAudio(audioElement, "key"));

        it("removes the audio", function() {
            expect(nextState.audio).to.exist;
            let keys = Object.keys(nextState.audio);
            expect(keys).to.have.length(0);
        });
    });
});