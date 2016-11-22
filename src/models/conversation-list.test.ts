import { expect } from "chai";

import ConversationList from "./conversation-list";

describe("ConversationList", function() {
    it("can be created", function() {
        let conversations = new ConversationList();
        expect(conversations).to.have.length(0);
    });
});