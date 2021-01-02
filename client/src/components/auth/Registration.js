import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import PropTypes from 'prop-types';
import { register } from '../../actions/authActions';
import Logout from './Logout';

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

    handleSubmit() {
        const { firstName, lastName, email, password } = this.state;

        const newUser = {
            firstName,
            lastName,
            email,
            password
        };

        this.props.register(newUser);
    }

    componentDidUpdate(prevProps) {
        const { error } = this.props;
        if (error !== prevProps.error) {
            if (error.id === 'REGISTER_FAIL') {
                this.setState({ errorMsg: error.msg.msg });
            }
            else {
                this.setState({ msg: null });
            }
        }
    }

    render() {
        return (
            <div>
                {this.props.isAuthenticated ?
                    <Alert color="warning">
                        authenticated
                </Alert> : <Alert color="warning">
                        not authenticated
                            </Alert>
                }
                <Form>
                    <FormGroup>
                        <Label for="FirstName">First Name</Label>
                        <Input type="text" name="firstName" id="FirstName" onChange={this.handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="LastName">Last Name</Label>
                        <Input type="text" name="lastName" id="LastName" onChange={this.handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="Email">Email</Label>
                        <Input type="email" name="email" id="Email" placeholder="Enter email" onChange={this.handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="Password">Password</Label>
                        <Input type="password" name="password" id="Password" placeholder="Enter password" onChange={this.handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="RepeatedPassword">Confirm Password</Label>
                        <Input type="password" name="repeatedPassword" id="RepeatedPassword" placeholder="Repeat Password" onChange={this.handleChange} />
                    </FormGroup>
                    <FormGroup>
                        <Logout />
                        <Button color="info" onClick={this.handleSubmit}>Submit</Button>
                    </FormGroup>
                    <Alert color="danger">
                        {this.state.errorMsg}
                    </Alert>
                </Form>
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