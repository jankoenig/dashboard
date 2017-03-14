import { RemoveAudioAction, StoreAudioAction } from "../actions/audio";
import { REMOVE_AUDIO, STORE_AUDIO, } from "../constants";
import Numbers from "../utils/numbers";

type AudioStateMap = { [key: string]: HTMLAudioElement };

export type AudioState = {
    audio: AudioStateMap
};

const INITIAL_STATE: AudioState = {
    audio: {}
};

type AudioAction = StoreAudioAction | RemoveAudioAction | { type: "" };

export function audio(state: AudioState = INITIAL_STATE, action: AudioAction): AudioState {
    switch (action.type) {
        case STORE_AUDIO: {
            let audioMap: AudioStateMap = { ...state.audio };
            let key = action.key ? action.key : Numbers.hashCode(action.audio.outerHTML);
            audioMap[key.toString()] = action.audio;
            return {...state, audio: audioMap};
        }
        case REMOVE_AUDIO: {
            let audioMap: AudioStateMap = {...state.audio};
            let key = action.key ? action.key : Numbers.hashCode(action.audio.outerHTML);
            delete audioMap[key.toString()];
            return {...state, audio: audioMap};
        }
        default: {
            return {...state};
        }
    }
}