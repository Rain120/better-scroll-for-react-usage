import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import App from 'components/App';
import Index from 'components/Index';
import NotFound from 'components/NotFound';

export default class Routes extends React.Component {
  render() {
    return (
      <Router>
        <App />
        <Switch>
          <Route exact={true} path='/' component={Index} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    )
  }
}
