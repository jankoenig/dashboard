import * as React from "react";
import { Button } from "react-toolbox/lib/button";
import Input from "react-toolbox/lib/input";
import { Cell, Grid } from "./Grid";
import { Dimensions, Measure } from "./Measure";

const ButtonTheme = require("../themes/button_theme.scss");
const InputTheme = require("../themes/input.scss");
const VendorPaneStyle = require("../themes/amazon_pane.scss");

export default class AmazonVendorPane extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            myHeight: 0
        };

        this.onMeasure = this.onMeasure.bind(this);
        this.handleVendorIDChange = this.handleVendorIDChange.bind(this);
    }

    onMeasure(dimensions: Dimensions) {
        this.state.myHeight = dimensions.height;
        this.setState(this.state);
    }

    handleVendorIDChange(value: string) {
        this.setState({...this.state, vendorID: value});
    }

    handleUpdateVendorId(vendorId: string) {
        // stub for vendorId Update
    }

    render() {
        let spacing = this.props.spacing !== undefined && this.props.spacing;
        return (
            <Measure
                onMeasure={this.onMeasure} >
                <Grid
                    style={this.props.style}
                    className={`${this.props.className} ${VendorPaneStyle.main_grid}`}
                    noSpacing={spacing}>
                    <Cell className={VendorPaneStyle.left_cell} col={9} phone={4} tablet={6}>
                        <div className={VendorPaneStyle.left_container}>
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
                        </div>
                    </Cell>
                    <Cell className={VendorPaneStyle.right_cell} col={3} hidePhone={true} tablet={2}>
                        <div style={{margin: 20, backgroundColor: "#fff"}}>
                            call to action placeholder
                        </div>
                    </Cell>
                </Grid >
            </Measure>
        );
    }
}
