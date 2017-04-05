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
            expect(source.created).to.exist;
        });

        it("sets all properties", function () {
            let created = new Date();

            let source = new Source({
                name: "source",
                secretKey: "id",
                profile: SourceProfileAmazonAlexa,
                created: created
            });

            expect(source).to.exist;
            expect(source.secretKey).to.equal("id");
            expect(source.name).to.equal("source");
            expect(source.profile).to.equal(SourceProfileAmazonAlexa);
            expect(source.created).to.equal(created.toISOString());
        });

        it("sets the created property from a string", function() {

            let created = "2016-11-10T15:11:21.636Z";

            let source = new Source({
                name: "source",
                secretKey: "id",
                profile: SourceProfileAmazonAlexa,
                created: created
            });

            expect(source.created).to.exist;

            const date = new Date(source.created);
            expect(date.getDate()).to.equal(10);
            expect(date.getMinutes()).to.equal(11);
        });
    });
});