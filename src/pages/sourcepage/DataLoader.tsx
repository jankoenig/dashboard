import Query from "../../models/query";

export enum DataState {
    LOADING, ERROR, LOADED
}

export interface DataLoader<ServerData, ClientData> {
    loadData: (query: Query) => Promise<ServerData>;
    map: (data: ServerData) => ClientData;
}

export interface LoadCallback<ClientData> {
    onLoaded: (data: ClientData) => void;
    onError: (err: Error) => void;
}

export interface StateHandler {
    stateChange: (state: DataState) => void;
}

export class GenericStateHandler<Data> implements StateHandler, LoadCallback<Data> {
    readonly dataStateVariable: string;
    readonly dataVariable: string;
    readonly setState: (state: any) => void;
    state: any;

    constructor(state: any, dataStateVarable: string, dataVariable: string, setState: (state: any) => void) {
        this.dataVariable = dataVariable;
        this.dataStateVariable = dataStateVarable;
        this.state = state;
        this.setState = setState;
    }

    stateChange(state: DataState) {
        console.info("STATE CHANGE " + state);
        this.state[this.dataStateVariable] = state;
        this.setState(this.state);
    }

    onLoaded(data: Data) {
        console.info("ON LOADED");
        this.state[this.dataVariable] = data;
        this.setState(this.state);
    }

    onError(err: Error) {
        // Error is caught in the state change. Nothing we need to do.
    }
}

export class Loader {
    dataLoader: DataLoader<any, any>;
    stateHandler: StateHandler;
    loadCallback: LoadCallback<any>;

    constructor(dataLoader: DataLoader<any, any>, stateHandler: StateHandler, loadCallback: LoadCallback<any>) {
        this.dataLoader = dataLoader;
        this.stateHandler = stateHandler;
        this.loadCallback = loadCallback;
    }

    load(query: Query) {
        this.stateHandler.stateChange(DataState.LOADED);
        this.dataLoader.loadData(query).then((value: any) => {
            const loadedData: any = this.dataLoader.map(value);
            this.stateHandler.stateChange(DataState.LOADED);
            this.loadCallback.onLoaded(loadedData);
        }).catch((err: Error) => {
            console.error(err);
            this.stateHandler.stateChange(DataState.ERROR);
            this.loadCallback.onError(err);
        });
    }
}