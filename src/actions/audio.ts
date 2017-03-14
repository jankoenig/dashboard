import { REMOVE_AUDIO, STORE_AUDIO } from "../constants";

export type StoreAudioAction = {
    type: STORE_AUDIO,
    audio: HTMLAudioElement,
    key?: number | string
};

export function storeAudio(audio: HTMLAudioElement, key?: number | string): StoreAudioAction {
    return {
        type: STORE_AUDIO,
        audio,
        key
    };
};

export type RemoveAudioAction = {
    type: REMOVE_AUDIO,
    audio: HTMLAudioElement,
    key?: number | string
};

export function removeAudio(audio: HTMLAudioElement, key?: number | string): RemoveAudioAction {
    return {
        type: REMOVE_AUDIO,
        audio,
        key
    };
}