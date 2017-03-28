import * as React from "react";

import { Tab, Tabs } from "react-toolbox";

import ResizingComponent from "../../components/ResizingComponent";
import Source from "../../models/Source";
import ExpressJS from "./IntegrationExpressJS";
import Java from "./IntegrationJava";
import NodeJS from "./IntegrationNodeJSLambda";
import Spokes from "./IntegrationSpokes";

let TabsTheme = require("./themes/tabs.scss");

interface IntegrationPageProps {
    source: Source;
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
        const { tabIndex } = this.state;
        const { showSecret, source } = this.props;
        const { secretKey } = source;
        return (
            <ResizingComponent overflowY="hidden" >
                <section>
                    <Tabs theme={TabsTheme} fixed inverse index={tabIndex} onChange={this.handleTabChange} >
                        <Tab label="Node.JS Lambda">
                            <ResizingComponent>
                                <NodeJS secretKey={secretKey} showSecret={showSecret} />
                            </ResizingComponent>
                        </Tab>
                        <Tab label="Express.JS">
                            <ResizingComponent>
                                <ExpressJS secretKey={secretKey} showSecret={showSecret} />
                            </ResizingComponent>
                        </Tab>
                        <Tab label="Java">
                            <ResizingComponent>
                                <Java secretKey={secretKey} showSecret={showSecret} />
                            </ResizingComponent>
                        </Tab>
                        <Tab label="Spokes">
                            <ResizingComponent>
                                <Spokes
                                source={source} />
                            </ResizingComponent>
                        </Tab>
                    </Tabs>
                </section>
            </ResizingComponent>
        );
    }
}

export default IntegrationPage;