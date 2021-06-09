import React, { Component } from 'react';
import './App.css';
import { createBrowserHistory } from 'history';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { loadUser } from './actions/userActions';
import Registration from './components/auth/Registration';
import Login from './components/auth/Login';
import Dashboard from './components/Dashboard';
import { Router } from 'react-router-dom';
import PrivateRoute from './utils/PrivateRoute';
import AuthRoute from './utils/AuthRoute';
import AddTeam from './components/team/AddTeam';
import Members from './components/team/Members';
import AddTeamRoute from './utils/AddTeamRoute';
import Tasks from './components/tasks/Tasks';
import AppBar from './components/AppBar';

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
        <AddTeamRoute path="/addTeam" component={AddTeam} />
        <PrivateRoute path="/members" component={Members} />
        <PrivateRoute path="/tasks" component={Tasks} />
        <PrivateRoute path="/test" component={AppBar} />

      </Router>
    );
  }
}

App.propTypes = {
  loadUser: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.user.isAuthenticated,
  userIsLoading: state.user.userIsLoading
});

export default connect(mapStateToProps, { loadUser })(App);
