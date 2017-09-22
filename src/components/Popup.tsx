import * as React from "react";
import { Button } from "react-toolbox/lib/button";

const ReactModal: any = require("react-modal");
const ButtonTheme = require("../themes/button_theme.scss");

interface PopupProps {
    handleCloseModal?: any;
    handleEnterContest?: any;
    showModal?: boolean;
    header?: any;
    content?: any;
    imgSrc?: string;
    buttonLabel?: string;
    showButton?: boolean;
}

export default class Popup extends React.Component<PopupProps, any> {
    constructor(props: any) {
        super(props);
    }

    static defaultProps: PopupProps = {
        header: "",
        content: "",
        buttonLabel: "",
        showButton: false,
    };

    render() {
        return (
            <ReactModal
                style={{
                    overlay: {
                        zIndex: 5,
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                    },
                    content: {
                        border: "3px solid #faebd7",
                        top: "20%",
                        left: "30%",
                        bottom: "auto",
                        right: "30%",
                        overflow: "hidden",
                    }
                }}
                isOpen={this.props.showModal}
                contentLabel="onRequestClose Example"
                onRequestClose={this.props.handleCloseModal}>
                <div onClick={this.props.handleCloseModal} style={{ position: "absolute", top: 5, right: 10, cursor: "pointer", opacity: .7 }}>X</div>
                <h3 style={{ textAlign: "center" }}>{this.props.header}</h3>
                <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <img style={{ width: "20%", marginLeft: "3%", marginBottom: "20px" }} src={this.props.imgSrc} alt="echo show" />
                    <div style={{ width: "77%", padding: "10px 10px 10px 20px" }}>{this.props.content}</div>
                </div>
                {
                    this.props.showButton &&
                    <div style={{ width: "100%", textAlign: "center" }}>
                        (<Button
                            theme={ButtonTheme}
                            raised={true}
                            primary={true}
                            onClick={this.props.handleEnterContest}
                            label={this.props.buttonLabel} />)
                    </div>
                }
            </ReactModal>
        );
    }
}
