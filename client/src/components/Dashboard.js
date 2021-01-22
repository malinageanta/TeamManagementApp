import React, { Component } from 'react';
import Logout from './auth/Logout';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { SideBar } from './SideBar';

class Dashboard extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <SideBar />
                <Logout />
            </div>
        )
    }

}
Dashboard.propTypes = {
    isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(Dashboard);
