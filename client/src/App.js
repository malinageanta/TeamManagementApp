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
import DashboardRoute from './utils/DashboardRoute';
import AddTeam from './components/team/AddTeam';
import CreateTeam from './components/team/CreateTeam';
import JoinTeam from './components/team/JoinTeam';
import Members from './components/team/Members';


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
        <DashboardRoute path="/dashboard" component={Dashboard} />
        <PrivateRoute path="/addTeam" component={AddTeam} />
        <PrivateRoute path="/createTeam" component={CreateTeam} />
        <PrivateRoute path="/joinTeam" component={JoinTeam} />
        <PrivateRoute path="/members" component={Members} />

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
