import * as Firebase from "firebase";
import { createBrowserHistory } from "history";
import "isomorphic-fetch";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as ReactGA from "react-ga";
import { Provider } from "react-redux";
import { Route, Router } from "react-router-dom";
import { replace, syncHistoryWithStore } from "react-router-redux";
import { autoRehydrate, persistStore } from "redux-persist";

import { LOGOUT_USER } from "./constants";

import { setUser } from "./actions/session";

import AuthCheckRoute from "./AuthCheckRoute";

import ConvoRoute from "./ConvoRoute";
import IntegrationRoute from "./IntegrationRoute";
import LinkRoute from "./LinkRoute";
import LoginRoute from "./LoginRoute";
import NewSourceRoute from "./NewSourceRoute";
import NotFoundRoute from "./NotFoundRoute";
import SetSourceRoute from "./SetSourceRoute";
import SourceListRoute from "./SourceListRoute";
import SourceRoute from "./SourceRoute";

import { FirebaseUser } from "./models/user";

import rootReducer from "./reducers";

import configureStore from "./store";

import { State } from "./reducers";

console.log("v" + VERSION + "-" + BUILD_NUMBER);

// Initialize Google Analytics
ReactGA.initialize(GOOGLE_ANALYTICS);

// Creates the Redux reducer with the redux-thunk middleware, which allows us
// to do asynchronous things in the actions
// Help with this from https://github.com/ReactTraining/react-router/issues/353#issuecomment-181786502
// And http://stackoverflow.com/a/38123375/1349766
const browserHistory = createBrowserHistory({
    basename: BASENAME
});

// Configure the store
const store = configureStore(browserHistory, rootReducer, autoRehydrate() as Redux.StoreEnhancer<State.All>);
persistStore(store, { whitelist: ["session"] });

// And our history
const history = syncHistoryWithStore(browserHistory, store);

// Bootstrap Firebase
let firebaseConfig = {
    apiKey: "AIzaSyB1b8t0rbf_x2ZEhJel0pm6mQ4POZLgz-k", // It is ok for this to be public - MMM
    authDomain: "bespoken-tools.firebaseapp.com",
    databaseURL: "https://bespoken-tools.firebaseio.com",
    storageBucket: "bespoken-tools.appspot.com",
    messagingSenderId: "629657216103"
};

// Timing the firebase initialize
console.time("FirebaseInitialize");

Firebase.initializeApp(firebaseConfig);
Firebase.auth().onAuthStateChanged(function (user: Firebase.User) {
    console.timeEnd("FirebaseInitialize");
    const state = store.getState();
    const lastUser = state.session.user;
    const location = state.routing.locationBeforeTransitions;
    const newLocation = {...location, ...{pathname: "/" }}; // Doing this will pass along any query parameters that may exist.
    // If there is a user, set it
    if (user) {
        if (!lastUser || lastUser.userId !== user.uid) {
            store.dispatch(setUser(new FirebaseUser(user)));
            if (!lastUser) {
                store.dispatch(replace(newLocation));
            }
        }
    } else {
        if (lastUser) {
            store.dispatch({ type: LOGOUT_USER });
            store.dispatch(setUser(undefined));
            store.dispatch(replace("/login"));
        }
    }
    // We need to wait for the user to be available before we can render the app
    render();
});

let render = function () {
    ReactDOM.render((
        <Provider store={store}>
            <Router history={history}>
                <Route path="/login" component={LoginRoute} />
                <Route path="/" component={AuthCheckRoute} >
                    <Route exact component={LinkRoute} />
                    <Route path="skills" component={SourceListRoute} />
                    <Route path="skills/new"  component={NewSourceRoute} />
                    <Route path="skills/:sourceId" component={SetSourceRoute} >
                        <Route exact component={SourceRoute} />
                        <Route path=":sourceId/logs" component={ConvoRoute} />
                        <Route path=":sourceId/integration" component={IntegrationRoute} />
                    </Route>
                    <Route path="notFound" component={NotFoundRoute} />
                    <Route path="*" component={NotFoundRoute} />
                </Route>
            </Router>
        </Provider>
    ),
        document.getElementById("dashboard")
    );
};

