import React, { Component } from 'react';
import { Card, Button } from 'react-bootstrap';
import addTeamBackground from '../../images/join-team.png';
import '../../css/Team.css';
import '../../css/Authentication.css';
import { connect } from 'react-redux';
import { IconButton, TextField } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Logout from '../auth/Logout';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { Alert } from '@material-ui/lab';
import { createTeam, setTeamItem, getUserTeam } from '../../actions/teamActions';
import { setUserItem } from '../../actions/userActions';
import { Redirect } from 'react-router';


class AddTeam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            createFormOpen: false,
            joinFormOpen: false,
            logout: false,
            errorMsg: null,
            createTeamInput: "",
            joinTeamInput: ""
        };

        this.handleLogout = this.handleLogout.bind(this);
        this.handleCreateFormClose = this.handleCreateFormClose.bind(this);
        this.handleCreateFormOpen = this.handleCreateFormOpen.bind(this);
        this.handleJoinFormOpen = this.handleJoinFormOpen.bind(this);
        this.handleJoinFormClose = this.handleJoinFormClose.bind(this);
        this.handleCreateTeam = this.handleCreateTeam.bind(this);
        this.handleCreateFormInput = this.handleCreateFormInput.bind(this);
        this.getCreateForm = this.getCreateForm.bind(this);
        this.getJoinForm = this.getJoinForm.bind(this);
        this.handleJoinTeam = this.handleJoinTeam.bind(this);
        this.handleJoinFormInput = this.handleJoinFormInput.bind(this);

    }

    componentDidUpdate(prevProps) {
        const { error } = this.props;
        if (error !== prevProps.error) {
            if (error.id === 'CREATE_TEAM_FAIL' || error.id === 'GET_TEAM_FAIL') {
                this.setState({ errorMsg: error.msg.msg });
            }
            else {
                this.setState({ errorMsg: null });
            }
        }
    }

    handleLogout() {
        this.setState({
            logout: true
        })
    }

    handleCreateFormClose() {
        this.setState({
            createFormOpen: false,
            errorMsg: null
        })
    }

    handleCreateFormOpen() {
        this.setState({
            createFormOpen: true
        })
    }

    handleCreateFormInput(event) {
        this.setState({
            createTeamInput: event.target.value
        });
    }

    getCreateForm() {
        const alert = <Alert variant="outlined" severity="error"> {this.state.errorMsg} </Alert>
        const form =
            <Dialog className="create-team-dialog" open={this.state.createFormOpen} onClose={this.handleCreateFormClose} aria-labelledby="form-dialog-title">
                <DialogTitle className="dialog-title"> Choose a name for your team! </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Team Name"
                        type="text"
                        fullWidth
                        className="dialog-input"
                        onChange={this.handleCreateFormInput}
                    />
                    {this.state.errorMsg ? alert : null}
                </DialogContent>
                <DialogActions>
                    <Button className="option-button" variant="danger" onClick={this.handleCreateFormClose}>
                        Cancel
                    </Button>
                    <Button className="submit-button" variant="info" onClick={this.handleCreateTeam}>
                        Add
                    </Button>
                </DialogActions>
            </Dialog>

        return form;
    }

    handleCreateTeam() {
        const name = this.state.createTeamInput;
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
                if (!this.state.errorMsg) {
                    this.props.setUserItem(id, 'team', name, false);
                    this.props.setUserItem(id, 'role', 'admin', false);
                }
            })
    }

    handleJoinFormClose() {
        this.setState({
            joinFormOpen: false,
            errorMsg: null
        })
    }

    handleJoinFormOpen() {
        this.setState({
            joinFormOpen: true
        })
    }

    handleJoinFormInput(event) {
        this.setState({
            joinTeamInput: event.target.value
        });
    }

    getJoinForm() {
        const alert = <Alert variant="outlined" severity="error"> {this.state.errorMsg} </Alert>
        const form =
            <Dialog className="join-team-dialog" open={this.state.joinFormOpen} onClose={this.handleCreateFormClose} aria-labelledby="form-dialog-title">
                <DialogTitle className="addTeam-header"> Tell us the team you want to join! </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Team Name"
                        type="text"
                        fullWidth
                        className="dialog-input"
                        onChange={this.handleJoinFormInput}
                    />
                    {this.state.errorMsg ? alert : null}
                </DialogContent>
                <DialogActions>
                    <Button className="submit-button" variant="info" onClick={this.handleJoinFormClose}>
                        Cancel
                    </Button>
                    <Button className="option-button" variant="danger" onClick={this.handleJoinTeam}>
                        Add
                    </Button>
                </DialogActions>
            </Dialog>

        return form;
    }

    handleJoinTeam() {
        const name = this.state.joinTeamInput;
        const user_id = this.props.user._id;
        const newMember = this.props.user.email;

        this.props.getUserTeam(name)
            .then((team) => {
                if (team) {
                    const team_id = this.props.team._id;
                    const members = this.props.team.members;
                    members.push(newMember);
                    this.props.setUserItem(user_id, 'team', name, false);
                    this.props.setTeamItem(team_id, 'members', members);
                }
            })
    }

    render() {
        const team = this.props.user.team;
        if (team) {
            return <Redirect to="/dashboard" />
        }
        const createForm = this.getCreateForm();
        const joinForm = this.getJoinForm();

        return (
            <div>
                <div className="split right">
                    <div className="centered">
                        <img alt="Check it out" src={addTeamBackground} />
                    </div>
                </div>
                <div className="split left">
                    <div className="centered">
                        <h1 className="addTeam-header">Hello, {this.props.user.firstName}!</h1>
                        <h5 className="addTeam-subheader"> Currently, you are not part of any team!</h5>
                        <Card className="text-center card" style={{ backgroundColor: 'transparent', border: 'none', color: 'white', paddingTop: "24px" }}>
                            <Button className="create-button" variant="outline-danger" onClick={this.handleCreateFormOpen} name="create">Create a new team</Button>
                            {createForm}
                            {joinForm}
                            <h5 className="addTeam-subheader"> or </h5>
                            <Button className="join-button" variant="outline-info" onClick={this.handleJoinFormOpen} name="join">Join a team</Button>
                            <Card.Footer style={{ backgroundColor: 'transparent', border: 'none' }}>
                                <h8 className="addTeam-subheader"> Did you change your mind? </h8>
                                <IconButton className="exit-button" onClick={() => this.handleLogout()}>
                                    <ArrowForwardIcon className="exit-icon" fontSize="small" />
                                    {this.state.logout ? <Logout /> : null}
                                </IconButton>
                            </Card.Footer>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) => ({
    user: state.user.user,
    error: state.error,
    team: state.team.team
});

export default connect(mapStateToProps, { createTeam, setUserItem, setTeamItem, getUserTeam })(AddTeam);
