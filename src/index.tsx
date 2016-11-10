import * as Firebase from "firebase";
import { createHistory } from "history";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { EnterHook, IndexRoute, RedirectFunction, Route, Router, RouterState, useRouterHistory } from "react-router";
import { syncHistoryWithStore } from "react-router-redux";

import { setUser } from "./actions/session";
import Dashboard from "./frames/Dashboard";
import Login from "./frames/Login";
import { FirebaseUser } from "./models/user";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import LogsPage from "./pages/LogsPage";
import NewSourcePage from "./pages/NewSourcePage";
import NotFoundPage from "./pages/NotFoundPage";
import SourceListPage from "./pages/SourceListPage";
import rootReducer from "./reducers";

import configureStore from "./store";

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

let render = function () {
    ReactDOM.render(
        <Provider store={store}>
            <Router history={history}>
                <Route path="/login" component={Login}>
                    <IndexRoute component={LoginPage} />
                </Route>
                <Route path="/" component={Dashboard} onEnter={checkAuth}>
                    <IndexRoute component={HomePage} />
                    <Route path="/skills" component={SourceListPage} />
                    <Route path="/skills/new" component={NewSourcePage} />
                    <Route path="/skills/:sourceSlug/logs" component={LogsPage} />
                    <Route path="*" component={NotFoundPage} />
                </Route>
            </Router>
        </Provider>,
        document.getElementById("dashboard")
    );
};


