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
        this.state[this.dataStateVariable] = state;
        this.setState(this.state);
    }

    onLoaded(data: Data) {
        this.state[this.dataVariable] = data;
        this.setState(this.state);
    }

    onError(err: Error) {
        // Error is caught in the state change. Nothing we need to do.
    }
}

export class Loader<ServerData, ClientData> {
    dataLoader: DataLoader<ServerData, ClientData>;
    stateHandler: StateHandler;
    loadCallback: LoadCallback<ClientData>;

    constructor(dataLoader: DataLoader<ServerData, ClientData>, stateHandler: StateHandler, loadCallback: LoadCallback<ClientData>) {
        this.dataLoader = dataLoader;
        this.stateHandler = stateHandler;
        this.loadCallback = loadCallback;
    }

    load(query: Query): Promise<ClientData> {
        this.stateHandler.stateChange(DataState.LOADING);
        return this.dataLoader.loadData(query)
            .then((value: ServerData) => {
                const loadedData: ClientData = this.dataLoader.map(value);
                this.stateHandler.stateChange(DataState.LOADED);
                this.loadCallback.onLoaded(loadedData);
                return loadedData;
            }).catch((err: Error) => {
                console.error(err);
                this.stateHandler.stateChange(DataState.ERROR);
                this.loadCallback.onError(err);
                throw err;
            });
    }
}