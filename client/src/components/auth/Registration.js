import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { register } from '../../actions/authActions';
import sideImage from '../../images/teamwork-and-team-building.png';
import '../../css/Authentication.css';
import { Card } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Link, Redirect } from 'react-router-dom';

class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            repeatedPassword: '',
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
        const { firstName, lastName, email, password } = this.state;

        const newUser = {
            firstName,
            lastName,
            email,
            password
        };
        if (this.state.repeatedPassword === this.state.password) {
            this.props.register(newUser);
        }
        else {
            if (this.state.repeatedPassword !== null) {
                this.setState({ errorMsg: "The passwords does not match." })
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
        alert =
            <Alert severity="error">
                {this.state.errorMsg}
            </Alert>
        return (
            <div>
                <div className="split right">
                    <div className="centered">
                        <img src={sideImage} />
                    </div>
                </div>
                <div>
                    <div className="split left">
                        <div className="centered">
                            <h1 style={{ marginBottom: "18px", color: "#3C4166" }}>Sign up</h1>
                            <Card style={{ minWidth: "30vw" }} variant="outlined">
                                <Form onSubmit={this.handleSubmit}>
                                    <Form.Row>
                                        <Form.Group as={Col} style={{ textAlign: "left" }}>
                                            <Form.Label style={{ padding: "10px" }}>First Name</Form.Label>
                                            <Form.Control type="text" name="firstName" id="FirstName" placeholder="Enter first name" onChange={this.handleChange} />
                                        </Form.Group>
                                        <Form.Group as={Col} style={{ textAlign: "left" }}>
                                            <Form.Label style={{ padding: "10px" }}>Last Name</Form.Label>
                                            <Form.Control type="text" name="lastName" id="LastName" placeholder="Enter last name" onChange={this.handleChange} />
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Group style={{ textAlign: "left" }}>
                                        <Form.Label style={{ padding: "10px" }}>Email</Form.Label>
                                        <Form.Control type="email" name="email" id="Email" placeholder="Enter email" onChange={this.handleChange} />
                                    </Form.Group>
                                    <Form.Row>
                                        <Form.Group as={Col} style={{ textAlign: "left" }}>
                                            <Form.Label style={{ padding: "10px" }}>Password</Form.Label>
                                            <Form.Control type="password" name="password" id="Password" placeholder="Enter password" onChange={this.handleChange} />
                                        </Form.Group>
                                        <Form.Group as={Col} style={{ textAlign: "left" }}>
                                            <Form.Label style={{ padding: "10px" }}>Confirm Password</Form.Label>
                                            <Form.Control type="password" name="repeatedPassword" id="RepeatedPassword" placeholder="Repeat Password" onChange={this.handleChange} />
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Group>
                                        <Link to="/">
                                            <Button variant="danger">Login</Button>
                                        </Link>
                                        &nbsp;&nbsp;&nbsp;
                                            <Button variant="info" type="submit">Submit</Button>
                                    </Form.Group>
                                </Form>
                                {this.state.errorMsg ? alert : null}
                            </Card>
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
    isAuthenticated: state.auth.isAuthenticated,
    error: state.error
});

export default connect(mapStateToProps, { register })(Registration);