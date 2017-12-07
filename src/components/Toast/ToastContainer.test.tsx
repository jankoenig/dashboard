import * as chai from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import ToastContainer from "./ToastContainer";

const middlewares = [thunk];
const mockStore: any = configureMockStore(middlewares);

let expect = chai.expect;

describe("Toast Container", function () {
    let initialState = {};

    let store = mockStore(initialState);
    it("renders correctly with no toasts", function () {
        const wrapper = shallow(<Provider store={store}><ToastContainer /></Provider>);
        expect(wrapper.find("ul")).to.have.length(0);
    });
});

