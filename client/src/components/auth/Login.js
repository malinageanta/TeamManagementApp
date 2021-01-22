import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { login } from '../../actions/authActions';
import sideImage from '../../images/teamwork-and-team-building.png';
import '../../css/Authentication.css';
import { Card } from '@material-ui/core';
import { Alert } from '@material-ui/lab'
import { Link, Redirect } from 'react-router-dom'


class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
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
        const { email, password } = this.state;
        const user = {
            email,
            password
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
                <div className="split left">
                    <div className="centered">
                        <h1 style={{ marginBottom: "36px", color: "#3C4166" }}>Login</h1>
                        <Card style={{ minWidth: "30vw" }} variant="outlined">
                            <Form onSubmit={this.handleSubmit}>
                                <Form.Group style={{ textAlign: "left" }}>
                                    <Form.Label style={{ padding: "10px" }}>Email</Form.Label>
                                    <Form.Control type="email" name="email" id="Email" placeholder="Enter email" onChange={this.handleChange} />
                                </Form.Group>
                                <Form.Group style={{ textAlign: "left" }}>
                                    <Form.Label style={{ padding: "10px" }}>Password</Form.Label>
                                    <Form.Control type="password" name="password" id="Password" placeholder="Enter password" onChange={this.handleChange} />
                                </Form.Group>
                                <Form.Group>
                                    <Link to="/registration">
                                        <Button variant="danger">Sign up</Button>
                                    </Link>
                                    &nbsp;&nbsp;&nbsp;
                                    <Button variant="info" type="submit">Login</Button>
                                </Form.Group>
                            </Form>
                            {this.state.errorMsg ? alert : null}
                        </Card>
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
    isAuthenticated: state.auth.isAuthenticated,
    error: state.error
});

export default connect(mapStateToProps, { login })(Registration);