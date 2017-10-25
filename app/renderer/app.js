import React, { Component } from 'react';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import { routes } from './routes.js';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="app">
          {routes.map((route, i) => (
            <Route
              key={i}
              path={route.path}
              render={props => <route.component {...props} />}
            />
          ))}
        </div>
      </Router>
    );
  }
}

export default App;
