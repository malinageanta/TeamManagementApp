import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { setUserItem } from '../actions/userActions';
import { getUserTeam, createTeam } from '../actions/teamActions';
import { Avatar } from '@material-ui/core';
import '../css/Drawer.css';
import NavBar from './NavBar';
import Activities from './team/Activities';



class Dashboard extends Component {

    render() {

        return (
            <div>
                <NavBar />
                <Activities />
            </div>
        )
    }

}
Dashboard.propTypes = {
    isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
    user: state.user.user
});

export default connect(mapStateToProps,
    {
        setUserItem, getUserTeam, createTeam
    }
)(Dashboard);
