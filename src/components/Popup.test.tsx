import * as chai from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import { Button } from "react-toolbox/lib/button";
import Popup from "./Popup";

let expect = chai.expect;

const handleCloseModal = () => {
    console.log("handleCloseModal");
};

const handleEnterContest = () => {
    console.log("handleEnterContest");
};

describe("Popup", function () {
    it("should render correctly", function () {
        const wrapper = shallow(<Popup
            header={"Win an Echo Show"}
            content={"Thanks for being a Bespoken user. Take this 5-minute survey to enter to win 1 of 2 devices."}
            imgSrc="https://bespoken.io/wp-content/uploads/2017/08/Background.png"
            showButton={true}
            buttonLabel="Enter Now"
            showModal={true}
            handleCloseModal={handleCloseModal}
            handleEnterContest={handleEnterContest}
        />);
        expect(wrapper.find("h3").text()).to.equal("Win an Echo Show");
        expect(wrapper.find("div").at(2).text()).to.equal("Thanks for being a Bespoken user. Take this 5-minute survey to enter to win 1 of 2 devices.");
        expect(wrapper.find("img").props().src).to.equal("https://bespoken.io/wp-content/uploads/2017/08/Background.png");
        expect(wrapper.find(Button).props().label).to.equal("Enter Now");
    });
});
