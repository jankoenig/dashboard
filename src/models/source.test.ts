import { expect } from "chai";

import Source, { Members } from "./source";

describe("Source", function () {
    describe("constructor", function () {
        it("check defauts", function () {
            let source = new Source({ name: "source" });
            expect(source.name).to.be.equal("source");
            expect(source.members).to.exist;
            expect(source.id).to.be.undefined;
            expect(source.secretKey).to.be.undefined;
            expect(source.created).to.be.undefined;
        });

        it("sets all properties", function () {
            let created = new Date();
            let members: Members = {};
            members["user1"] = "ABCD";
            members["user2"] = "EFGH";
            members["user3"] = "IJKL";

            let source = new Source({
                name: "source",
                secretKey: "id",
                created: created,
                members: members,
                id: "source-jfjfh"
            });

            expect(source).to.exist;
            expect(source.secretKey).to.equal("id");
            expect(source.name).to.equal("source");
            expect(source.created).to.equal(created.toISOString());
            expect(source.members).to.deep.equal(members);
        });

        it("sets the created property from a string", function() {

            let created = "2016-11-10T15:11:21.636Z";

            let source = new Source({
                name: "source",
                created: created
            });

            expect(source.created).to.exist;

            const date = new Date(source.created);
            expect(date.getDate()).to.equal(10);
            expect(date.getMinutes()).to.equal(11);
        });
    });
});