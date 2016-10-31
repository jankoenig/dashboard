// import { expect } from "chai";

import Source from "../models/source";
import source from "./source";

describe("Source Service", function() {
    it("creates a new Source", function() {
        let src = new Source({id: "id", name: "name"});

        source.createSource(src);
    });
});