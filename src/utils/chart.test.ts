import { expect } from "chai";
import * as moment from "moment";

import chartUtils from "./chart";

describe("chart utils", function () {

    let data: any = [];

    before(function() {
      for (let i = 0; i < 5; ++i) {
        const item: any = {};
        item.prop = i;
        item.dateProp = moment().subtract(i, "days");
        console.log(item.dateProp);
        data.push(item);
      }
    });

    describe("createTicks", function() {
      describe("with data to create ticks", function() {
        it("returns the correct number of data", function() {
          const result = chartUtils.createTicks(data, "dateProp");
          expect(result).to.have.length(5);
        });
      });
    });
      describe("with no data to create ticks", function() {
        it("returns the correct number of data", function() {
          const result = chartUtils.createTicks([], "dateProp");
          expect(result).to.have.length(0);
        });
    });
});
