import { expect } from "chai";

import Skill from "./skill";

describe("Skill", function() {
    describe("constructor", function() {
        it("sets the properties", function() {
            let skill = new Skill({ id: "id", displayName: "displayName"});
            expect(skill.id).to.eq("id");
            expect(skill.displayName).to.eq("displayName");
        });
    });
});