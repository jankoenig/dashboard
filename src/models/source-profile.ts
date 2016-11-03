
export default class SourceProfile {
    constructor(readonly name: string) {
    }
}

export const SourceProfileUnspecifiedName = "UNSPECIFIED";
export const SourceProfileAmazonAlexaName = "ALEXA_SKILLS_KIT";
export const SourceProfileGoogleAssistantName = "GOOGLE_CONVERSATION_ACTION";

export const SourceProfileUnspecified = new SourceProfile(SourceProfileUnspecifiedName);
export const SourceProfileAmazonAlexa = new SourceProfile(SourceProfileAmazonAlexaName);
export const SourceProfileGoogleAssistant = new SourceProfile(SourceProfileGoogleAssistantName);

