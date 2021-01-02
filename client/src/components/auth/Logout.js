import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import { logout } from '../../actions/authActions';

class Logout extends Component {
    render() {
        return (
            <Button color="danger" onClick={this.props.logout}>
                Logout
            </Button>
        )
    }
}

Logout.propTypes = {
    logout: PropTypes.func.isRequired
};

export default connect(null, { logout })(Logout);
