import * as Firebase from "firebase";
import { createHistory } from "history";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { EnterHook, IndexRoute, RedirectFunction, Route, Router, RouterState, useRouterHistory } from "react-router";
import { routerMiddleware, syncHistoryWithStore } from "react-router-redux";
import { applyMiddleware, createStore,  } from "redux";
import thunk from "redux-thunk";

import Dashboard from "./frames/Dashboard";
import Login from "./frames/Login";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import LogsPage from "./pages/LogsPage";
import NotFoundPage from "./pages/NotFoundPage";
import rootReducer from "./reducers";

// Creates the Redux reducer with the redux-thunk middleware, which allows us
// to do asynchronous things in the actions
// Help with this from https://github.com/ReactTraining/react-router/issues/353#issuecomment-181786502
// And http://stackoverflow.com/a/38123375/1349766
const browserHistory = useRouterHistory(createHistory)({
    basename: "/dashboard"
});
// Create the history middleware which is needed for routing
const historyMiddleware = routerMiddleware(browserHistory);
// We now create the store, connecting it with thunk middleware and the history middleware we just built
const createStoreWithMiddleware = applyMiddleware(thunk, historyMiddleware)(createStore);
// Finally, our store which is created from our reducers
const store = createStoreWithMiddleware(rootReducer);
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

Firebase.initializeApp(firebaseConfig);
Firebase.auth().onAuthStateChanged(function(user: Firebase.User) {
    console.log("onAuthStateChanged");
    console.log(user);
});

/**
 * Checks if the user exists before entering routes that require a user.
 *
 * See below on the onEnter method.
 */
let checkAuth: EnterHook = function(nextState: RouterState, replace: RedirectFunction) {

    // TODO: make this type safe
    const session: any = store.getState().session;
    if (!session.user) {
        replace("/login");
    }
};

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/login" component={Login}>
                <IndexRoute component={LoginPage} />
            </Route>
            <Route path="/" component={Dashboard} onEnter={checkAuth}>
                <IndexRoute component={ HomePage } />
                <Route path="/skills/:source/logs" component={LogsPage}/>
                <Route path="*" component={NotFoundPage} />
            </Route>
        </Router>
    </Provider>,
    document.getElementById("container")
);
