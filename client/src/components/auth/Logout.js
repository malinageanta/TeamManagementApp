import { connect } from 'react-redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { logout } from '../../actions/userActions';

class Logout extends Component {
    render() {
        return (
            <div>
                {this.props.logout()}
            </div>
        )
    }
}

Logout.propTypes = {
    logout: PropTypes.func.isRequired
};

export default connect(null, { logout })(Logout);
