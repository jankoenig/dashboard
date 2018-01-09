import * as React from "react";
import { Button } from "react-toolbox/lib/button";
import Input from "react-toolbox/lib/input";
import auth from "../services/auth";
import { Dimensions, Measure } from "./Measure";
import LandingAmazonPageTwoPane from "./SourcePageTwoPane";

const ButtonTheme = require("../themes/button_theme.scss");
const InputTheme = require("../themes/input.scss");
const VendorPaneStyle = require("../themes/amazon_pane.scss");

export default class AmazonVendorPane extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            myHeight: 0,
            vendorID: "",
        };

        this.onMeasure = this.onMeasure.bind(this);
        this.handleVendorIDChange = this.handleVendorIDChange.bind(this);
        this.handleUpdateVendorId = this.handleUpdateVendorId.bind(this);
    }

    onMeasure(dimensions: Dimensions) {
        this.state.myHeight = dimensions.height;
        this.setState(this.state);
    }

    handleVendorIDChange(value: string) {
        this.setState({...this.state, vendorID: value});
    }

    async handleUpdateVendorId() {
        const updatedUser = await auth.updateCurrentUser({vendorID: this.state.vendorID});
        if (updatedUser) {
            // finish importing sources and redirect to validation page
        } else {
            // redirect to landing no amazon flow
        }
    }

    render() {
        let spacing = this.props.spacing !== undefined && this.props.spacing;
        return (
            <Measure
                onMeasure={this.onMeasure}>
                <LandingAmazonPageTwoPane spacing={spacing}>
                    {(
                        <div>
                            <h5>We only need one more piece of information before getting you started</h5>
                            <h4>Please enter your vendorID</h4>
                            <span>
                                    <Input
                                        style={{color: "#000"}}
                                        theme={InputTheme}
                                        label="Vendor ID"
                                        value={this.state.vendorID}
                                        onChange={this.handleVendorIDChange}
                                        required={true}/>
                                </span>
                            <small>To
                                retrieve your vendor ID, <a href="https://developer.amazon.com/mycid.html"
                                                            target="_blank">click here</a>
                            </small>
                            <Button
                                className={VendorPaneStyle.vendor_button}
                                theme={ButtonTheme}
                                raised={true}
                                primary={true}
                                onClick={this.handleUpdateVendorId}
                                label="Get Started  >"/>
                        </div>
                    )}
                    {"call to action placeholder"}
                </LandingAmazonPageTwoPane>
            </Measure>
        );
    }
}
