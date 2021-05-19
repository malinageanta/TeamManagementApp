import React, { Component } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import background from '../../images/teamInfoBg.png';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { Alert } from '@material-ui/lab'
import { setUserItem } from '../../actions/userActions';
import { setTeamItem, getUserTeam } from '../../actions/teamActions';


class JoinTeam extends Component {
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
        const user_id = this.props.user._id;
        const newMember = this.props.user.email;

        this.props.getUserTeam(name)
            .then((team) => {
                if (team) {
                    const team_id = this.props.team._id;
                    const members = this.props.team.members;
                    members.push(newMember);
                    this.props.setUserItem(user_id, 'team', name);
                    this.props.setTeamItem(team_id, 'members', members);
                }
            })
    }

    componentDidUpdate(prevProps) {
        const { error } = this.props;
        if (error !== prevProps.error) {
            if (error.id === 'GET_TEAM_FAIL') {
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
                                        <Card.Title style={{ fontWeight: 'lighter', fontSize: '32px' }}>Enter the team name you want to join</Card.Title>
                                        <Form onSubmit={this.handleSubmit}>
                                            <Form.Group>
                                                <Form.Control type="text" name="name" onChange={this.handleChange} placeholder="Enter team name" style={{ fontWeight: 'lighter' }} />
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
    error: state.error,
    team: state.team.team
});

export default connect(mapStateToProps, { setUserItem, setTeamItem, getUserTeam })(JoinTeam);