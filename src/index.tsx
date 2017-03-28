import * as Firebase from "firebase";
import { createHistory } from "history";
import "isomorphic-fetch";
import * as ReactDOM from "react-dom";
import * as ReactGA from "react-ga";
import { Provider } from "react-redux";
import { EnterHook, IndexRoute, RedirectFunction, Route, Router, RouterState, useRouterHistory } from "react-router";
import { replace, syncHistoryWithStore } from "react-router-redux";
import { autoRehydrate, persistStore } from "redux-persist";

import { LOGOUT_USER } from "./constants";

import { setUser } from "./actions/session";
import Dashboard from "./frames/Dashboard";

import Login from "./frames/Login";
import Source from "./models/source";
import { FirebaseUser } from "./models/user";
import CreateOrRoute from "./pages/createpage/CreateOrRoute";
import IntegrationPage from "./pages/integration/StateIntegrationPage";
import LoginPage from "./pages/LoginPage";
import LogsPage from "./pages/logspage/ConvoPage";
import NewSourcePage from "./pages/NewSourcePage";
import NotFoundPage from "./pages/NotFoundPage";
import SourceListPage from "./pages/SourceListPage";
import SourcePage from "./pages/sourcepage/SourcePage";
import rootReducer from "./reducers";

import IndexUtils from "./index-utils";
import configureStore from "./store";

import { State } from "./reducers";

console.log("v" + VERSION + "-" + BUILD_NUMBER);

// Initialize Google Analytics
ReactGA.initialize(GOOGLE_ANALYTICS);

// Creates the Redux reducer with the redux-thunk middleware, which allows us
// to do asynchronous things in the actions
// Help with this from https://github.com/ReactTraining/react-router/issues/353#issuecomment-181786502
// And http://stackoverflow.com/a/38123375/1349766
const browserHistory = useRouterHistory(createHistory)({
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
    const lastUser = store.getState().session.user;
    // If there is a user, set it
    if (user) {
        if (!lastUser || lastUser.userId !== user.uid) {
            store.dispatch(setUser(new FirebaseUser(user)));
            if (!lastUser) {
                store.dispatch(replace("/#welcome"));
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

/**
 * Checks if the user exists before entering routes that require a user.
 *
 * See below on the onEnter method.
 */
let checkAuth: EnterHook = function (nextState: RouterState, replace: RedirectFunction) {
    const session: any = store.getState().session;
    if (!session.user) {
        replace({
            pathname: "/login",
            state: { nextPathName: nextState.location.pathname }
        });
    }
};

let onUpdate = function () {
    ReactGA.pageview(window.location.pathname);
};

let setSource = function (nextState: RouterState, replace: RedirectFunction) {
    let sources: Source[] = store.getState().source.sources;
    let sourceId: string = nextState.params["sourceId"];
    IndexUtils.dispatchSelectedSourceSource(store.dispatch, sourceId, sources)
        .catch(function (a?: Error) {
            console.info("ERROR " + a);
            console.error(a);
            // TODO: Put in a 404.
        });
};

let removeSource = function () {
    IndexUtils.removeSelectedSource(store.dispatch);
};

let render = function () {
    ReactDOM.render((
        <Provider store={store}>
            <Router history={history} onUpdate={onUpdate}>
                <Route path="/login" component={Login}>
                    <IndexRoute component={LoginPage} />
                </Route>
                <Route path="/" component={Dashboard} onEnter={checkAuth}>
                    <IndexRoute component={CreateOrRoute} />
                    <Route path="/skills" component={SourceListPage} />
                    <Route path="/skills/new" component={NewSourcePage} />
                    <Route path="/skills/:sourceId" onEnter={setSource} onLeave={removeSource} >
                        <IndexRoute component={SourcePage} />
                        <Route path="/skills/:sourceId/logs" component={LogsPage} />
                        <Route path="/skills/:sourceId/integration" component={IntegrationPage} />
                    </Route>
                    <Route path="*" component={NotFoundPage} />
                </Route>
            </Router>
        </Provider>
    ),
        document.getElementById("dashboard")
    );
};


