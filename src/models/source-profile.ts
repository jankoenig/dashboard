
export default class SourceProfile {
    constructor(readonly name: string) {
    }
}

export const SourceProfileAmazonAlexaName = "ALEXA_SKILLS_KIT";
export const SourceProfileGoogleAssistantName = "GOOGLE_CONVERSATION_ACTION";

export const SourceProfileAmazonAlexa = new SourceProfile(SourceProfileAmazonAlexaName);

export const SourceProfileGoogleAssistant = new SourceProfile(SourceProfileGoogleAssistantName);

