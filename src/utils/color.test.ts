import { expect } from "chai";

import Color from "./color";

describe("Color", function() {
    describe("HEX2RGB", function() {
        it("converts white", function() {
            let rgb = Color.HEX2RGB("#ffffff");
            expect(rgb.r).to.equal(255);
            expect(rgb.g).to.equal(255);
            expect(rgb.b).to.equal(255);
        });
        it("converts black", function() {
            let rgb = Color.HEX2RGB("#000000");
            expect(rgb.r).to.equal(0);
            expect(rgb.g).to.equal(0);
            expect(rgb.b).to.equal(0);
        });
        it("converts bespoken blue", function() {
            let rgb = Color.HEX2RGB("#054a91");
            expect(rgb.r).to.equal(5);
            expect(rgb.g).to.equal(74);
            expect(rgb.b).to.equal(145);
        });
    });
    describe("RGB2HEX", function() {
        it("converts white", function() {
            let rgb = {r: 255, g: 255, b: 255};
            expect(Color.RGB2HEX(rgb)).to.equal("#ffffff");
        });
        it("converts black", function() {
            let rgb = {r: 0, g: 0, b: 0};
            expect(Color.RGB2HEX(rgb)).to.equal("#000000");
        });
        it("converts bespoken blue", function() {
            let rgb = {r: 5, g: 74, b: 145};
            expect(Color.RGB2HEX(rgb)).to.equal("#054a91");
        });
    });
    describe("RGB2HSV", function() {
        it("converts white", function() {
            let rgb = { r: 255, g: 255, b: 255};
            let hsv = Color.RGB2HSV(rgb);
            expect(hsv.hue).to.equal(0);
            expect(hsv.saturation).to.equal(0);
            expect(hsv.value).to.equal(100);
        });
        it("converts black", function() {
            let rgb = { r: 0, g: 0, b: 0};
            let hsv = Color.RGB2HSV(rgb);
            expect(hsv.hue).to.equal(0);
            expect(hsv.saturation).to.equal(0);
            expect(hsv.value).to.equal(0);
        });
        it("converts bespoken blue", function() {
            let rgb = { r: 5, g: 74, b: 145};
            let hsv = Color.RGB2HSV(rgb);
            expect(hsv.hue).to.equal(210.4);
            expect(hsv.saturation).to.equal(96.6);
            expect(hsv.value).to.equal(56.9);
        });
    });
    describe("HSV2RGB", function() {
        it("converts white", function() {
            let hsv = { hue: 0, saturation: 0, value: 100};
            let rgb = Color.HSV2RGB(hsv);
            expect(rgb.r).to.equal(255);
            expect(rgb.g).to.equal(255);
            expect(rgb.b).to.equal(255);
        });
        it("converts black", function() {
            let hsv = { hue: 0, saturation: 0, value: 0};
            let rgb = Color.HSV2RGB(hsv);
            expect(rgb.r).to.equal(0);
            expect(rgb.g).to.equal(0);
            expect(rgb.b).to.equal(0);
        });
        it("converts bespoken blue", function() {
            let hsv = { hue: 210.4, saturation: 96.6, value: 56.9};
            let rgb = Color.HSV2RGB(hsv);
            expect(rgb.r).to.equal(5);
            expect(rgb.g).to.equal(74);
            expect(rgb.b).to.equal(145);
        });
    });
    describe("hueShift", function() {
        it("shifts the hue 180", function() {
            let shiftedHue = Color.hueShift(210.4, 180);
            expect(shiftedHue).to.be.closeTo(30.4, 0.01);
        });
    });
    describe("complementaryColor", function() {
        it("complements white", function() {
            expect(Color.complementaryColor("#ffffff")).to.equal("#ffffff");
        });
        it("complements black", function() {
            expect(Color.complementaryColor("#000000")).to.equal("#000000");
        });
        it("complements bespoken blue", function() {
            expect(Color.complementaryColor("#054a91")).to.equal("#914c05");
        });
    });
});