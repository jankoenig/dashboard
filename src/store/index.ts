import * as HistoryModule from "history";
import { routerMiddleware } from "react-router-redux";
import { applyMiddleware, compose, createStore } from "redux";

import thunk from "redux-thunk";

import { State } from "../reducers";

export default function configureStore(history: HistoryModule.History, rootReducer: Redux.Reducer<State.All>, ...enhancers: Redux.StoreEnhancer<State.All>[]): Redux.Store<State.All> {
    const historyMiddleware = routerMiddleware(history);
    const historyEnhancers = applyMiddleware(thunk, historyMiddleware);
    const storeEnhancers = (enhancers) ?
        compose(
            historyEnhancers,
            ...enhancers
        ) :
        historyEnhancers;
    return createStore(rootReducer, storeEnhancers) as Redux.Store<State.All>;
}