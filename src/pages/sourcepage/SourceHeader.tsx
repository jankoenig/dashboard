import * as moment from "moment";
import * as React from "react";

import DataTile from "../../components/DataTile";
import { Cell, Grid } from "../../components/Grid";
import Source from "../../models/source";
import { NAVY_BLUE } from "../../utils/colors";

const DEFAULT_TEXT_FORMAT = "MMM Do, YYYY";

interface SourceHeaderProps {
    source: Source;
    rootStyle?: React.CSSProperties;
    tileColor?: string;
}

interface SourceHeaderState {

}

export class SourceHeader extends React.Component<SourceHeaderProps, SourceHeaderState> {

    static DEFAULT_SOURCE: Source = new Source({
        name: "N/A",
        secretKey: "N/A",
        id: "N/A",
        profile: undefined,
        created: new Date(0, 0, 0, 0, 0, 0, 0)
    });

    static defaultProps: SourceHeaderProps = {
        source: SourceHeader.DEFAULT_SOURCE,
        rootStyle: { backgroundColor: "rgb(36, 48, 54)", paddingBottom: "0px", paddingTop: "0px" },
        tileColor: NAVY_BLUE
    };

    render() {
        const { source, rootStyle, tileColor } = this.props;
        const dataTileStyle = { inputTextColor: tileColor, bottomBorderColor: tileColor };
        return (
            <Grid style={rootStyle}>
                <Cell col={3} hidePhone={true}>
                    <DataTile
                        theme={dataTileStyle}
                        value={source.name}
                        label={"Name"} />
                </Cell>
                <Cell col={3} hidePhone={true} >
                    <DataTile
                        theme={dataTileStyle}
                        value={source.id}
                        label={"ID"} />
                </Cell>
                <Cell col={3} hidePhone={true} >
                    <DataTile
                        theme={dataTileStyle}
                        value={moment(source.created).format(DEFAULT_TEXT_FORMAT)}
                        label={"Created"} />
                </Cell>
                <Cell col={3} hidePhone={true} >
                    <DataTile
                        theme={dataTileStyle}
                        value={source.secretKey}
                        label={"Secret Key"}
                        hidden={true}
                        showable={true} />
                </Cell>
            </Grid>
        );
    }
}

export default SourceHeader;