
// Import third-party libraries

import * as ReactDOM from "react-dom";
import { Route, IndexRoute, Router, useRouterHistory, EnterHook, RouterState, RedirectFunction } from "react-router";
import { syncHistoryWithStore, routerMiddleware } from "react-router-redux";
import { createHistory } from "history";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import rootReducer from "./reducers";

// Import our pages
import Dashboard from "./frames/Dashboard";
import HomeView from "./pages/HomeView";
import CounterPage from "./pages/CounterPage";
import NotFoundView from "./pages/NotFoundView";
import AboutView from "./pages/AboutView";
import Login from "./frames/Login";
import LoginPage from "./pages/LoginPage";

import auth  from "./services/auth";

// Creates the Redux reducer with the redux-thunk middleware, which allows us
// to do asynchronous things in the actions
// Help with this from https://github.com/ReactTraining/react-router/issues/353#issuecomment-181786502
// And http://stackoverflow.com/a/38123375/1349766 
const browserHistory = useRouterHistory(createHistory)({
    basename: '/dashboard'
});
const historyMiddleware = routerMiddleware(browserHistory);
const createStoreWithMiddleware = applyMiddleware(thunk, historyMiddleware)(createStore);
const store = createStoreWithMiddleware(rootReducer);
const history = syncHistoryWithStore(browserHistory, store);
// For debugging
history.listen(location => console.log(location));

console.log("store");
console.log(store);

/* store.subscribe(() => {
    console.log("subscribe listener");
    console.log(store.getState());
}); */

let checkAuth: EnterHook = function(nextState: RouterState, replace: RedirectFunction) {

    console.log("loggedIn() ?");
    console.log(auth.loggedIn());

    console.log("nextState.location.state " + nextState.location.state);
    console.log("nextState.location.pathname " + nextState.location.pathname);

    // check if the path isn"t dashboard
    // that way we can apply specific logic
    // to display/render the path we want to
    if (nextState.location.pathname !== "/") {
        if (auth.loggedIn()) {
            if (nextState.location.state && nextState.location.pathname) {
                replace(nextState.location.pathname);
            } else {
                replace("/login");
            }
        }
    } else {
        // If the user is already logged in, forward them to the homepage
        if (!auth.loggedIn()) {
            if (nextState.location.state && nextState.location.pathname) {
                replace(nextState.location.pathname);
            } else {
                replace("/login");
            }
        }
    }
};

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/login" component={Login}>
                <IndexRoute component={LoginPage} />
            </Route>
            <Route path="/" component={Dashboard} onEnter={checkAuth}>
                <IndexRoute component={HomeView} />
                <Route path="about" component={AboutView}/>
                <Route path="counter" component={CounterPage}/>
                <Route path="*" component={NotFoundView} />
            </Route>
        </Router>
    </Provider>,
    document.getElementById("container")
);
