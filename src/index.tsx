import * as Firebase from "firebase";
import { createHistory } from "history";
import "isomorphic-fetch";
import * as ReactDOM from "react-dom";
import * as ReactGA from "react-ga";
import { Provider } from "react-redux";
import { EnterHook, IndexRoute, RedirectFunction, Route, Router, RouterState, useRouterHistory } from "react-router";
import { syncHistoryWithStore } from "react-router-redux";

import { setUser } from "./actions/session";
import Dashboard from "./frames/Dashboard";

import Login from "./frames/Login";
import Source from "./models/source";
import { FirebaseUser } from "./models/user";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import LogsPage from "./pages/logspage/LogsPage";
import NewSourcePage from "./pages/NewSourcePage";
import NotFoundPage from "./pages/NotFoundPage";
import SourceListPage from "./pages/SourceListPage";
import rootReducer from "./reducers";

import IndexUtils from "./index-utils";
import configureStore from "./store";

// Initialize Google Analytics
ReactGA.initialize("UA-40630247-7");

// Creates the Redux reducer with the redux-thunk middleware, which allows us
// to do asynchronous things in the actions
// Help with this from https://github.com/ReactTraining/react-router/issues/353#issuecomment-181786502
// And http://stackoverflow.com/a/38123375/1349766
const browserHistory = useRouterHistory(createHistory)({
    basename: "/dashboard"
});
// Configure the store
const store = configureStore(browserHistory, rootReducer);
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
let firebaseInitializeTimer = new Date();

Firebase.initializeApp(firebaseConfig);
Firebase.auth().onAuthStateChanged(function (user: Firebase.User) {
    let firebaseInitializeTime = +new Date() - +firebaseInitializeTimer;
    console.log("Firebase took " + firebaseInitializeTime + "ms to initialize");
    // If there is a user, set it
    if (user) {
        store.dispatch(setUser(new FirebaseUser(user)));
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

let onUpdate = function() {
    ReactGA.pageview(window.location.pathname);
};

let setSource = function (nextState: RouterState, replace: RedirectFunction) {
    let sources: Source[] = store.getState().source.sources;
    let sourceId: string = nextState.params["sourceId"];
    IndexUtils.dispatchSelectedSourceSource(store.dispatch, sourceId, sources)
        .catch(function (a?: Error) {
            console.info("ERROR " + a);
            // TODO: Put in a 404.
        });
};

let removeSource = function() {
    IndexUtils.removeSelectedSource(store.dispatch);
};

let render = function () {
    ReactDOM.render(
        <Provider store={store}>
            <Router history={history} onUpdate={onUpdate}>
                <Route path="/login" component={Login}>
                    <IndexRoute component={LoginPage} />
                </Route>
                <Route path="/" component={Dashboard} onEnter={checkAuth}>
                    <IndexRoute component={HomePage} />
                    <Route path="/skills" component={SourceListPage} />
                    <Route path="/skills/new" component={NewSourcePage} />
                    <Route path="/skill/:sourceId"  onEnter={setSource} onLeave={removeSource} >
                        <Route path="/skills/:sourceId/logs" component={LogsPage}/>
                    </Route>
                    <Route path="*" component={NotFoundPage} />
                </Route>
            </Router>
        </Provider>,
        document.getElementById("dashboard")
    );
};


