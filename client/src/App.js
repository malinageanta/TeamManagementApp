import React, { Component } from 'react';
import './App.css';
import { createBrowserHistory } from 'history';
import { connect } from 'react-redux';
import { getUsers } from './actions/userActions';
import PropTypes from 'prop-types';
import { loadUser } from './actions/authActions';
import Registration from './components/auth/Registration';
import Login from './components/auth/Login';
import Dashboard from './components/Dashboard';
import { Router, Switch, Route } from 'react-router-dom';
import PrivateRoute from './utils/PrivateRoute';
import AuthRoute from './utils/AuthRoute';


export const history = createBrowserHistory();

class App extends Component {
  constructor(props) {
    super(props);
    this.props.loadUser();
  }

  render() {
    return (
      <Router history={history}>
        <AuthRoute path="/registration" component={Registration} />
        <AuthRoute path="/" exact component={Login} />
        <PrivateRoute path="/dashboard" component={Dashboard} />
      </Router>
    );
  }
}

App.propTypes = {
  loadUser: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading
});

export default connect(mapStateToProps, { loadUser })(App);
