import * as React from "react";

import { Tab, Tabs } from "react-toolbox";

import Java from "./IntegrationJava";
import NodeJS from "./IntegrationNodeJs";

interface IntegrationPageProps {
    secretKey?: string;
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
            <section>
                <Tabs index={this.state.tabIndex} onChange={this.handleTabChange} >
                    <Tab label="NodeJS"><NodeJS secretKey={this.props.secretKey} /></Tab>
                    <Tab label="Java"><Java secretKey={this.props.secretKey} /></Tab>
                </Tabs>
            </section>
        );
    }
}

export default IntegrationPage;