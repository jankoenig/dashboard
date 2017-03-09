import * as chai from "chai";
import { shallow, ShallowWrapper } from "enzyme";
import * as moment from "moment";
import * as React from "react";

import DataTile from "../../components/DataTile";
import Source from "../../models/source";
import { dummySources } from "../../utils/test";
import SourceHeader from "./SourceHeader";

const expect = chai.expect;

describe("SourceHeader", function () {

    let source: Source;

    before(function () {
        source = dummySources(1)[0];
    });

    describe("Renders", function () {
        let wrapper: ShallowWrapper<any, any>;

        before(function () {
            wrapper = shallow(<SourceHeader
                source={source}
            />);
        });

        it("Tests the tiles exist.", function() {
            expect(wrapper.find(DataTile)).to.have.length(4);
        });

        it("Tests the name DataTile has appropriate props.", function() {
            const tile: ShallowWrapper<any, any> = wrapper.find(DataTile).at(0);
            expect(tile).to.have.prop("value", source.name);
        });

        it("Tests the name ID has appropriate props.", function() {
            const tile: ShallowWrapper<any, any> = wrapper.find(DataTile).at(1);
            expect(tile).to.have.prop("value", source.id);
        });

        it("Tests the Created DataTile has appropriate props.", function() {
            const formatted = moment(source.created).format("MMM Do, YYYY");
            const tile: ShallowWrapper<any, any> = wrapper.find(DataTile).at(2);
            expect(tile).to.have.prop("value", formatted);
        });

        it("Tests the secret key DataTile has appropriate props.", function() {
            const tile: ShallowWrapper<any, any> = wrapper.find(DataTile).at(3);
            expect(tile).to.have.prop("value", source.secretKey);
            expect(tile).to.have.prop("hidden", true);
            expect(tile).to.have.prop("showable", true);
        });
    });
});