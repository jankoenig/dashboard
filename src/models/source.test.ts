import { expect } from "chai";

import Source from "./source";
import { SourceProfileAmazonAlexa } from "./source-profile";

describe("Source", function () {
    describe("constructor", function () {
        it("provides a UUID", function () {
            let source = new Source({ name: "source" });
            expect(source).to.exist;
            expect(source.name).to.equal("source");
            expect(source.id).to.equal("source");
            expect(source.secretKey).to.exist;
            expect(source.profile).to.exist;
        });
        it("sets all properties", function () {
            let source = new Source({
                name: "source",
                secretKey: "id",
                profile: SourceProfileAmazonAlexa
            });

            expect(source).to.exist;
            expect(source.secretKey).to.equal("id");
            expect(source.name).to.equal("source");
            expect(source.profile).to.equal(SourceProfileAmazonAlexa);
        });
    });
});