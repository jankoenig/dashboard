import {Action} from "./action";

export class Intent {
  public name: string;
  public description: string;
  public utterances: Array<string>;
  public action: Action;
  constructor(name: string) {
    this.name = name;
    this.utterances = [];
  }
}
