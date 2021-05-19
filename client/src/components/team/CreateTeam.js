import React, { Component } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import background from '../../images/teamInfoBg.png';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { createTeam } from '../../actions/teamActions';
import { setUserItem } from '../../actions/userActions';
import { Alert } from '@material-ui/lab'


class CreateTeam extends Component {
    constructor(props) {
        super(props);

        this.state = {
            goBack: false,
            name: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleClick(e) {
        this.setState({
            goBack: true
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const name = this.state.name;
        const admin = this.props.user.email;
        const id = this.props.user._id;
        const members = [admin];
        const newTeam = {
            name,
            admin,
            members
        };

        this.props.createTeam(newTeam)
            .then(() => {
                this.props.setUserItem(id, 'team', name);
                this.props.setUserItem(id, 'role', 'admin');
            })

    }

    componentDidUpdate(prevProps) {
        const { error } = this.props;
        if (error !== prevProps.error) {
            if (error.id === 'CREATE_TEAM_FAIL') {
                this.setState({ errorMsg: error.msg.msg });
            }
            else {
                this.setState({ errorMsg: null });
            }
        }

    }

    render() {
        const team = this.props.user.team;
        if (team) {
            return <Redirect to="/dashboard" />
        }

        var alert = <Alert variant="outlined" severity="error"> {this.state.errorMsg} </Alert>
        const goBack = this.state.goBack;
        return (
            goBack === false ?
                <div style={{ backgroundImage: `url(${background})` }}>
                    <div className="container" style={{ height: '100vh', width: '100vh' }}>
                        <div className="row h-100">
                            <div id="col" className="col-md-12 my-auto">
                                <Card style={{ backgroundColor: 'transparent', border: 'none', color: 'white' }}>
                                    <Card.Body>
                                        <Card.Title style={{ fontWeight: 'lighter', fontSize: '32px' }}> Name your team </Card.Title>
                                        <Form onSubmit={this.handleSubmit}>
                                            <Form.Group>
                                                <Form.Control type="text" name="name" onChange={this.handleChange} placeholder="Enter name" style={{ fontWeight: 'lighter' }} />
                                            </Form.Group>
                                            <Form.Group>
                                                <Button variant="outline-danger" onClick={this.handleClick}>Go Back</Button>
                                                <Button variant="outline-primary" type="submit" style={{ float: 'right' }}>Submit</Button>
                                            </Form.Group>
                                        </Form>
                                        {this.state.errorMsg ? alert : null}
                                    </Card.Body>
                                </Card>
                            </div>
                        </div >
                    </div>
                </div>
                : <Redirect to="/addTeam" />
        )
    }

}

const mapStateToProps = (state) => ({
    user: state.user.user,
    error: state.error
});

export default connect(mapStateToProps, { createTeam, setUserItem })(CreateTeam);