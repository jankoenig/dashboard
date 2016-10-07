
import { createStore } from "redux";
import rootReducer from "./index";
import { expect } from "chai";

describe("rootReducer/session", function() {
  it("exists", () => {
    const store = createStore(rootReducer);
    const { session } = store.getState();
    expect(session).to.exist;
  });
});
