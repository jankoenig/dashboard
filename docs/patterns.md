
# Testing 

The tests for each file lives beside the file however with the extension `.test.ts` or `.test.tsx`.

To test a React Component, use the following pattern:

```
import * as React from "react";
import * as TestUtils from "react-addons-test-utils";
import { expect } from "chai";

import MyComponent from "./MyComponent";

describe("MyComponent", () => {
    let renderer: React.ShallowRenderer;

    beforeEach(function () {
        renderer = TestUtils.createRenderer();
        renderer.render(<MyComponent />);
    });

    it("should render correctly", function () {
        const result = renderer.getRenderOutput();
        expect(result.type).to.equal("div");
    });
});
```

# React Components TSX

The files within `./src/components` directory represent reusable UI components built with React.

```
import * as React from "react";
import * as classNames from "classnames";

// Define the properties as an interface.
export interface ComponentProps {
    drawer?: boolean;
    header?: boolean;
};

export default class Component extends React.Component<ComponentProps, any> {

    //Use classNames to dynamically build the classes for the component based on the properties
    classes() {
        return classNames("component", {
            "drawer": this.props.drawer,
            "header": this.props.header
        });
    }

    render() {
        //Wrap the HTML in parenthesis to allow proper formatting
        return (
            <div className={ this.classes() }>
                {this.props.children}
            </div>
        );
    }
}
```
