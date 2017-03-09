import * as React from "react";
import { IconButton } from "react-toolbox/lib/button";
import FontIcon from "react-toolbox/lib/font_icon";

interface AudioPlayerProps {
    url: string;
}

interface AudioPlayerState {
    audio?: HTMLAudioElement;
    icon: string;
    disabled: boolean;
}

export default class AudioPlayer extends React.Component<AudioPlayerProps, AudioPlayerState> {

    constructor(props: AudioPlayerProps) {
        super(props);
        this.state = {
            icon: "play_circle_outline",
            disabled: false
        };

        this.audioPauseListener = this.audioPauseListener.bind(this);
        this.audioPlayListener = this.audioPlayListener.bind(this);
        this.audioErrorListener = this.audioErrorListener.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    componentDidMount() {

        let existingAudioElement = document.getElementById(this.props.url);
        if (existingAudioElement) {
            console.log("We already had an audio element for " + this.props.url);
            console.log(existingAudioElement);
        }

        this.state.audio = new Audio(this.props.url);
        this.state.audio.id = this.props.url;
        this.state.audio.addEventListener("play", this.audioPlayListener);
        this.state.audio.addEventListener("pause", this.audioPauseListener);
        this.state.audio.addEventListener("error", this.audioErrorListener);
    }

    componentWillUnmount() {
        this.state.audio.removeEventListener("play", this.audioPlayListener);
        this.state.audio.removeEventListener("pause", this.audioPauseListener);
        this.state.audio.removeEventListener("error", this.audioErrorListener);
    }

    audioPlayListener() {
        this.state.icon = "pause_circle_outline";
        this.setState(this.state);
    }

    audioPauseListener() {
        this.state.icon = "play_circle_outline";
        this.setState(this.state);
    }

    audioErrorListener() {
        this.state.icon = "not_interested";
        this.state.disabled = true;
        this.setState(this.state);
    }

    onClick() {
        if (this.state.audio.paused) {
            try {
                this.state.audio.play();
            } catch (error) {
                this.state.icon = "not_interested";
            }
            this.state.audio.play();
        } else {
            this.state.audio.pause();
        }
    };

    render() {
        return (
            <span>
                <IconButton onClick={this.onClick} disabled={this.state.disabled}>
                    <FontIcon value={this.state.icon} />
                </IconButton>
            </span>
        );
    }
}