import * as React from "react";
import { connect } from "react-redux";
import { IconButton } from "react-toolbox/lib/button";
import FontIcon from "react-toolbox/lib/font_icon";

import { removeAudio, storeAudio } from "../../actions/audio";
import { State } from "../../reducers";
import Numbers from "../../utils/numbers";

interface AudioPlayerParentProps {
    url: string;
}

interface AudioPlayerStateProps {
    audio: { [key: number]: HTMLAudioElement };
}

function mapStateToProps(state: State.All): AudioPlayerStateProps {
    return {
        audio: state.audio.audio
    };
};

interface AudioPlayerDispatchProps {
    storeAudio?: (audio: HTMLAudioElement) => void;
    removeAudio?: (audio: HTMLAudioElement) => void;
}

function mapDispatchToProps(dispatch: Redux.Dispatch<any>): AudioPlayerDispatchProps {
    return {
        storeAudio: function (audio: HTMLAudioElement) {
            return dispatch(storeAudio(audio));
        },
        removeAudio: function (audio: HTMLAudioElement) {
            return dispatch(removeAudio(audio));
        }
    };
}

interface AudioPlayerProps extends AudioPlayerStateProps, AudioPlayerDispatchProps, AudioPlayerParentProps { };

function mergeProps(stateProps: AudioPlayerStateProps, dispatchProps: AudioPlayerDispatchProps, parentProps: AudioPlayerParentProps): AudioPlayerProps {
    return { ...parentProps, ...dispatchProps, ...stateProps };
}

interface AudioPlayerState {
    icon: string;
    disabled: boolean;
}

export class AudioPlayer extends React.Component<AudioPlayerProps, AudioPlayerState> {

    private audio: HTMLAudioElement;

    constructor(props: AudioPlayerProps) {
        super(props);
        this.state = {
            icon: "play_circle_outline",
            disabled: false
        };

        this.addEventListeners = this.addEventListeners.bind(this);
        this.audioPauseListener = this.audioPauseListener.bind(this);
        this.audioPlayListener = this.audioPlayListener.bind(this);
        this.audioEndedListener = this.audioEndedListener.bind(this);
        this.audioErrorListener = this.audioErrorListener.bind(this);
        this.setIcon = this.setIcon.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    componentDidMount() {
        let audio = new Audio(this.props.url);
        let key = Numbers.hashCode(audio.outerHTML);

        console.log(this.props.audio);

        // check to see if an audio element already exists
        if (this.props.audio[key]) {
            // and if it does, associate it with this component.
            this.audio = this.props.audio[key];
            this.addEventListeners();
            this.setIcon();
        }
    }

    componentWillUnmount() {
        if (this.audio) {
            this.audio.removeEventListener("play", this.audioPlayListener);
            this.audio.removeEventListener("pause", this.audioPauseListener);
            this.audio.removeEventListener("error", this.audioErrorListener);
        }
    }

    audioPlayListener() {
        this.setIcon();
    }

    audioPauseListener() {
        this.setIcon();
    }

    audioEndedListener() {
        // if it ended, clean it up
        this.props.removeAudio(this.audio);
    }

    audioErrorListener() {
        this.setIcon();
    }

    addEventListeners() {
        if (this.audio) {
            this.audio.addEventListener("play", this.audioPlayListener);
            this.audio.addEventListener("pause", this.audioPauseListener);
            this.audio.addEventListener("ended", this.audioEndedListener);
            this.audio.addEventListener("error", this.audioErrorListener);
        }
    }

    setIcon() {
        if (this.audio) {
            if (this.audio.error) {
                this.state.disabled = true;
                this.state.icon = "not_interested";
            } else {
                if (this.audio.paused) {
                    this.state.icon = "play_circle_outline";
                } else {
                    this.state.icon = "pause_circle_outline";
                }
            }

            this.setState(this.state);
        }
    }

    onClick() {
        if (!this.audio) {
            // if we don't have any audio, create one
            this.audio = new Audio(this.props.url);
            this.props.storeAudio(this.audio);
            this.addEventListeners();
            this.audio.play();
        } else {
            if (this.audio.paused) {
                try {
                    this.audio.play();
                } catch (error) {
                    console.error(error);
                    this.state.icon = "not_interested";
                }
            } else {
                this.audio.pause();
            }
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

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(AudioPlayer);