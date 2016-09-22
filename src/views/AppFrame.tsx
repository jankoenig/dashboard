
import * as React from 'react';
import { Layout, Header, HeaderRow, Textfield, Navigation, Drawer, Content } from 'react-mdl';

export default class AppFrame extends React.Component<any, any> {
    render() {
        return <div className="demo-big-content">
    <Layout>
        <Header waterfall hideTop>
            <HeaderRow title="Title">
                <Textfield
                    value=""
                    onChange={() => {}}
                    label="Search"
                    expandable
                    expandableIcon="search"
                />
            </HeaderRow>
            <HeaderRow>
                <Navigation>
                    <a href="">Link</a>
                    <a href="">Link</a>
                    <a href="">Link</a>
                    <a href="">Link</a>
                </Navigation>
            </HeaderRow>
        </Header>
        <Drawer title="Title">
            <Navigation>
                <a href="">Link</a>
                <a href="">Link</a>
                <a href="">Link</a>
                <a href="">Link</a>
            </Navigation>
        </Drawer>
        <Content>
            <div className="page-content" />
        </Content>
    </Layout>
</div>
    }
}
