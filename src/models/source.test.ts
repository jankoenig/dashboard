import { expect } from "chai";

import Source from "./source";
import { SourceProfileAmazonAlexa } from "./source-profile";

describe("Source", function () {
    describe("constructor", function () {
        it("provides a UUID", function () {
            let source = new Source({ name: "source" });
            expect(source).to.exist;
            expect(source.name).to.equal("source");
            expect(source.id).to.exist;
        });
        it("sets all properties", function () {
            let source = new Source({
                name: "source",
                id: "id",
                profile: SourceProfileAmazonAlexa
            });

            expect(source).to.exist;
            expect(source.id).to.equal("id");
            expect(source.name).to.equal("source");
            expect(source.profile).to.equal(SourceProfileAmazonAlexa);
        });
    });
});