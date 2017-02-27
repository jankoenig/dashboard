# Imports

Split the imports into two groups, third-party dependencies at the top followed by first-party.

```typescript
import * as React from "react";
import { connect } from "react-redux";

import { changeForm } from "../actions/authForm";
import { login } from "../actions/session";
import AuthForm from "../components/AuthForm";
import Card from "../components/Card";
import { Cell, Grid } from "../components/Grid";
import { Store } from "../reducers";
```

# Testing

The tests for each file lives beside the file however with the extension `.test.ts` or `.test.tsx`.

To test a React Component (.tsx), use the following pattern:

```typescript
import * as chai from "chai";
import { shallow } from "enzyme";
// tslint:disable:no-unused-variable
import * as React from "react"; // Needed for enzyme, unused for some reason.
// tslint:enable:no-unused-variable

import Navigation from "./Navigation";

let expect = chai.expect;

describe("Navigation", function() {
    it("renders correctly", function() {
        const wrapper = shallow(<Navigation name="name" path="/" />);
        expect(wrapper.find("nav")).to.have.length(1);
    });
});
```

To test a normal TypeScript file (.ts), use the following pattern:

```typescript
import { expect } from "chai";

import  User  from "./user";

describe("User", function() {
  describe("constructor", function() {
    it("should set the email and token", function() {
      let user = new User({email : "my@email.com"});
      expect(user.email).to.eq("my@email.com");
    });
  });
  it("can serialize", function() {
    let user = new User({email: "my@email.com"});
    let json = JSON.stringify(user);
    expect(json).to.eq("{\"email\":\"my@email.com\"}");
  });
  it ("can deserialize", function() {
    let user = new User({email: "my@email.com"});
    let json = JSON.stringify(user);
    let deserializedUser = new User(JSON.parse(json));
    expect(deserializedUser.email).to.equal(user.email);
  });
});
```

# React Components TSX

The files within `./src/components` directory represent reusable UI components built with React.

```typescript
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

# CSS/SASS

## To Import a CSS Module Globally

Sometimes you need to bring in external CSS globally, meaning the class names need to stay what they are.

```
import "!style!css!sass!react-dates/lib/css/_datepicker.css";
```

Help from https://github.com/css-modules/css-modules/pull/65#issuecomment-248280248