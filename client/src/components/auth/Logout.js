import { connect } from 'react-redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { logout } from '../../actions/userActions';
import { Redirect } from 'react-router-dom';



class Logout extends Component {
    render() {
        return (
            <div>
                {this.props.logout()}
                <Redirect to="/" />
            </div>
        )
    }
}

Logout.propTypes = {
    logout: PropTypes.func.isRequired
};

export default connect(null, { logout })(Logout);
