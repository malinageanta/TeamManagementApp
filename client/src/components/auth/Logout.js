import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { logout } from '../../actions/authActions';

class Logout extends Component {
    render() {
        return (
            <Button variant="danger" onClick={this.props.logout}>
                Logout
            </Button>
        )
    }
}

Logout.propTypes = {
    logout: PropTypes.func.isRequired
};

export default connect(null, { logout })(Logout);
