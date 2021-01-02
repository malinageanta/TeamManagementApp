import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import { getUsers } from './actions/userActions';
import PropTypes from 'prop-types';
import { loadUser } from './actions/authActions';
import store from './store';
import Registration from './components/auth/Registration';
import Login from './components/auth/Login';

class App extends Component {
  callApi() {
    fetch("/teams")
      .then(res => res.json())
      .then(users => this.setState({ users }));
  }

  componentDidMount() {
    //this.props.getUsers();
    //this.callApi();
    store.dispatch(loadUser());
  }

  render() {
    return (
      <div className="App">
        <Login />
      </div>
    );
  }
}

App.propTypes = {
  getUsers: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  user: state.user
});

export default connect(mapStateToProps, { getUsers })(App);
