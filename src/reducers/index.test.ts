import { expect } from "chai";
import { createStore } from "redux";

import rootReducer from "./index";

describe("Reducer ", function() {
  it("exists", () => {
    const store = createStore(rootReducer);
    const { session } = store.getState();
    expect(session).to.exist;
  });
});
