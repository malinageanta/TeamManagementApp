import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { login } from '../../actions/userActions';
import sideImage from '../../images/auth3.PNG';
import '../../css/Authentication.css';
import { Card, Box } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Link } from 'react-router-dom';


class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            role: '',
            team: '',
            photo: '',
            errorMsg: null
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const { email, password, role, team, photo } = this.state;
        const user = {
            email,
            password,
            role,
            team,
            photo
        };

        this.props.login(user);
    }

    componentDidUpdate(prevProps) {
        const { error } = this.props;
        if (error !== prevProps.error) {
            if (error.id === 'LOGIN_FAIL') {
                this.setState({ errorMsg: error.msg.msg });
            }
            else {
                this.setState({ errorMsg: null });
            }
        }

    }

    render() {
        var alert =
            <Alert severity="error">
                {this.state.errorMsg}
            </Alert>

        return (
            <div>
                <div className="split right">
                    <div className="centered">
                        <img alt="Check it out" src={sideImage} />
                    </div>
                </div>
                <div className="split left">
                    <div className="centered">
                        <h1 className="auth-header">Login</h1>
                        <Box boxShadow={3} className="auth-box">
                            <Card className="auth-card" variant="outlined">
                                <Form className="auth-form" onSubmit={this.handleSubmit}>
                                    <Form.Group className="auth-form-group">
                                        <Form.Control type="email" name="email" id="Email" placeholder="Email" onChange={this.handleChange} />
                                    </Form.Group>
                                    <Form.Group className="auth-form-group">
                                        <Form.Control type="password" name="password" id="Password" placeholder="Password" onChange={this.handleChange} />
                                    </Form.Group>
                                    <Form.Group>
                                        <Link to="/registration">
                                            <Button variant="danger" className="option-button">Sign up</Button>
                                        </Link>
                                    &nbsp;&nbsp;&nbsp;
                                    <Button variant="info" type="submit" className="submit-button">Login</Button>
                                    </Form.Group>
                                </Form>
                                {this.state.errorMsg ? alert : null}
                            </Card>
                        </Box>
                    </div>
                </div>
            </div >

        )
    }
}

Registration.propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    isAuthenticated: state.user.isAuthenticated,
    error: state.error
});

export default connect(mapStateToProps, { login })(Registration);