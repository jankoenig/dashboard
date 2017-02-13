import * as React from "react";

import { Tab, Tabs } from "react-toolbox";

import ResizingComponent from "../../components/ResizingComponent";
import ExpressJS from "./IntegrationExpressJS";
import Java from "./IntegrationJava";
import NodeJS from "./IntegrationNodeJSLambda";

let TabsTheme = require("./themes/tabs.scss");

interface IntegrationPageProps {
    secretKey?: string;
    showSecret?: boolean;
}

interface IntegrationPageState {
    tabIndex: number;
}

export class IntegrationPage extends React.Component<IntegrationPageProps, IntegrationPageState> {

    constructor(props: IntegrationPageProps) {
        super(props);
        this.handleTabChange = this.handleTabChange.bind(this);

        this.state = {
            tabIndex: 0
        };
    }

    handleTabChange(index: number) {
        this.state.tabIndex = index;
        this.setState(this.state);
    }

    render() {
        return (
            <ResizingComponent overflowY="hidden" >
                <section>
                    <Tabs theme={TabsTheme} fixed inverse index={this.state.tabIndex} onChange={this.handleTabChange} >
                        <Tab label="Node.JS Lambda">
                            <ResizingComponent>
                                <NodeJS secretKey={this.props.secretKey} showSecret={this.props.showSecret} />
                            </ResizingComponent>
                        </Tab>
                        <Tab label="Express.JS">
                            <ResizingComponent>
                                <ExpressJS secretKey={this.props.secretKey} showSecret={this.props.showSecret} />
                            </ResizingComponent>
                        </Tab>
                        <Tab label="Java">
                            <ResizingComponent>
                                <Java secretKey={this.props.secretKey} showSecret={this.props.showSecret} />
                            </ResizingComponent>
                        </Tab>
                    </Tabs>
                </section>
            </ResizingComponent>
        );
    }
}

export default IntegrationPage;