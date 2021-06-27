import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { register } from '../../actions/userActions';
import sideImage from '../../images/auth3.PNG';
import '../../css/Authentication.css';
import { Card, Box } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Link } from 'react-router-dom';

class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            repeatedPassword: '',
            role: '',
            team: '',
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
        const { firstName, lastName, email, password, role, team } = this.state;

        const newUser = {
            firstName,
            lastName,
            email,
            password,
            role,
            team
        };
        if (this.state.repeatedPassword === this.state.password) {
            this.props.register(newUser);
        }
        else {
            if (this.state.repeatedPassword !== null) {
                this.setState({ errorMsg: "The passwords do not match." })
            }
        }

    }

    componentDidUpdate(prevProps) {
        const { error } = this.props;
        if (error !== prevProps.error) {
            if (error.id === 'REGISTER_FAIL') {
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
                <div>
                    <div className="split left">
                        <div className="centered">
                            <h1 className="auth-header">Sign up</h1>
                            <Box boxShadow={3} className="auth-box">
                                <Card className="auth-card" variant="outlined">
                                    <Form onSubmit={this.handleSubmit}>
                                        <Form.Row>
                                            <Form.Group as={Col} className="auth-form-group">
                                                <Form.Control type="text" name="firstName" id="FirstName" placeholder="First name" onChange={this.handleChange} />
                                            </Form.Group>
                                            <Form.Group as={Col} className="auth-form-group">
                                                <Form.Control type="text" name="lastName" id="LastName" placeholder="Last name" onChange={this.handleChange} />
                                            </Form.Group>
                                        </Form.Row>
                                        <Form.Group className="auth-form-group">
                                            <Form.Control type="email" name="email" id="Email" placeholder="Email" onChange={this.handleChange} />
                                        </Form.Group>
                                        <Form.Row>
                                            <Form.Group as={Col} className="auth-form-group">
                                                <Form.Control type="password" name="password" id="Password" placeholder="Password" onChange={this.handleChange} />
                                            </Form.Group>
                                            <Form.Group as={Col} className="auth-form-group">
                                                <Form.Control type="password" name="repeatedPassword" id="RepeatedPassword" placeholder="Repeat Password" onChange={this.handleChange} />
                                            </Form.Group>
                                        </Form.Row>
                                        <Form.Group>
                                            <Link to="/">
                                                <Button variant="danger" className="option-button">Login</Button>
                                            </Link>
                                        &nbsp;&nbsp;&nbsp;
                                            <Button variant="info" type="submit" className="submit-button">Submit</Button>
                                        </Form.Group>
                                    </Form>
                                    {this.state.errorMsg ? alert : null}
                                </Card>
                            </Box>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Registration.propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    register: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    isAuthenticated: state.user.isAuthenticated,
    error: state.error
});

export default connect(mapStateToProps, { register })(Registration);