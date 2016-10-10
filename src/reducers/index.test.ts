
import { createStore } from "redux";
import rootReducer from "./index";
import { expect } from "chai";

describe("Reducer ", function() {
  it("exists", () => {
    const store = createStore(rootReducer);
    const { session } = store.getState();
    expect(session).to.exist;
  });
});
