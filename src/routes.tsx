import * as React from 'react';
import { Router, Route, IndexRoute, useRouterHistory } from 'react-router';
import { createHistory } from 'history';

import Dashboard from './frames/Dashboard';
import HomeView from './views/HomeView';
import NotFoundView from './views/NotFoundView';
import AboutView from './views/AboutView';

const history = useRouterHistory(createHistory)({
});

var routeMap = (
    <Router history={history}>
      <Route path="/" component={Dashboard}>
          <IndexRoute component={HomeView}/>
          <Route path="/about" component={AboutView}/>
          <Route path="*" component={NotFoundView} />
      </Route>
    </Router>
);

export default routeMap;
