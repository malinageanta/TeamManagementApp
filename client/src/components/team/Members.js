import { IconButton, Avatar, Box, TextField } from '@material-ui/core';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import SideBar from '../SideBar';
import '../../css/Members.css';
import axios from 'axios';
import { Card } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { deleteTeamMember, addTeamMember } from '../../actions/teamActions';
import { setUserItem } from '../../actions/userActions';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { Alert } from '@material-ui/lab';


class Members extends Component {
    constructor(props) {
        super(props);

        this.state = {
            allMembers: [],
            dialogOpen: false,
            memberToBeDeleted: "",
            formOpen: false,
            memberToBeAdded: "",
            errorMsg: null
        }

        this.getMemberInfo = this.getMemberInfo.bind(this);
        this.getMemberIcon = this.getMemberIcon.bind(this);
        this.handleMemberDelete = this.handleMemberDelete.bind(this);
        this.handleDialogClose = this.handleDialogClose.bind(this);
        this.handleDialogOpen = this.handleDialogOpen.bind(this);
        this.getMemberDeleteButton = this.getMemberDeleteButton.bind(this);
        this.getAllMembers = this.getAllMembers.bind(this);
        this.handleAddMember = this.handleAddMember.bind(this);
        this.getUsersCards = this.getUsersCards.bind(this);
        this.handleFormClose = this.handleFormClose.bind(this);
        this.handleFormOpen = this.handleFormOpen.bind(this);
        this.handleFormInput = this.handleFormInput.bind(this);
        this.getAddMemberForm = this.getAddMemberForm.bind(this);
    }


    componentDidMount() {
        this.getAllMembers();
    }

    componentDidUpdate(prevProps) {
        const { error } = this.props;
        if (error !== prevProps.error) {
            if (error.id === 'ADD_MEMBER_FAIL') {
                this.setState({ errorMsg: error.msg.msg });
            }
            else {
                this.setState({ errorMsg: null });
            }
        }
    }

    getAllMembers() {
        return axios.get('/users', {
            params: {
                team: this.props.user?.team
            }
        })
            .then(res => {
                this.setState({
                    allMembers: res.data
                })
            }
            )
            .catch(error => {
                console.log(error);
            })
    }

    getMemberIcon(member) {
        let image = null;
        if (member.photo) {
            image = <Avatar alt='user_photo' src={`${member.photo}`} className="member-icon" />;
        }
        else {
            const first = ((member.firstName).charAt(0)).toUpperCase();
            const last = ((member.lastName).charAt(0)).toUpperCase();
            image = <Avatar className="member-icon-default">{first + last}</Avatar>
        }

        return image;
    }

    getMemberInfo(member) {
        let info =
            <div>
                <div>{member.firstName} {member.lastName}</div>
                <div>{member.email}</div>
            </div>
        return info
    }

    getMemberDeleteButton(user, member) {
        let button = null;
        var isAdmin = user.role === "admin";
        var isCurrentUser = member.email === user.email;

        var canLeave = isCurrentUser && !isAdmin;
        var canDelete = !isCurrentUser && isAdmin;

        var disabledState = isCurrentUser ? !canLeave : !canDelete;
        var text = isCurrentUser ? "Leave" : "Delete";

        button =
            <Button size="small" color="primary" disabled={disabledState} onClick={() => this.handleDialogOpen(member)}>
                {text}
            </Button>

        return button;
    }

    getDeleteDialog() {
        return <Dialog
            open={this.state.dialogOpen}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Are you sure you want to remove this member?"}</DialogTitle>
            <DialogActions>
                <Button onClick={this.handleDialogClose} color="primary">
                    Disagree
                </Button>
                <Button onClick={this.handleMemberDelete} color="primary" autoFocus>
                    Agree
                </Button>
            </DialogActions>
        </Dialog>
    }

    handleDialogClose() {
        this.setState({
            dialogOpen: false
        })
    }

    handleDialogOpen(member) {
        this.setState({
            dialogOpen: true,
            memberToBeDeleted: member
        })
    }

    handleMemberDelete() {
        const team_id = this.props.team._id;
        const team_name = this.props.team.name;
        const user_id = this.state.memberToBeDeleted._id;
        this.props.deleteTeamMember(team_id, team_name, this.state.memberToBeDeleted.email)
            .then(() => {
                this.props.setUserItem(user_id, 'team', "", this.props.user._id !== user_id)
                    .then(async () => {
                        await this.getAllMembers();
                        this.handleDialogClose();
                    })
            })
    }

    getUsersCards(teamMembers, user) {
        return teamMembers?.map((member, index) =>
        (
            <Box p={1} key={index}>
                <Card className="member-card">
                    <Card.Body className="member-card-body">
                        {this.getMemberIcon(member)}
                        {this.getMemberInfo(member)}
                    </Card.Body>
                    <Card.Footer>
                        {this.getMemberDeleteButton(user, member)}
                    </Card.Footer>
                </Card>
            </Box>
        )
        )
    }

    handleFormClose() {
        this.setState({
            formOpen: false,
            errorMsg: null
        })
    }

    handleFormOpen(member) {
        this.setState({
            formOpen: true
        })
    }

    handleFormInput(event) {
        this.setState({
            memberToBeAdded: event.target.value
        });
    }

    handleAddMember() {
        const team_id = this.props.team._id;
        const team_name = this.props.team.name;
        const newMember = this.state.memberToBeAdded;
        this.props.addTeamMember(team_id, team_name, newMember)
            .then(async (res) => {
                await this.getAllMembers();
                if (res.status === 202) {
                    this.handleFormClose();
                    this.setState({
                        memberToBeAdded: ""
                    })
                }
            })
            .catch(error => {
                console.log(error);
            });


    }

    getAddMemberForm() {
        const alert = <Alert variant="outlined" severity="error"> {this.state.errorMsg} </Alert>
        const form =
            <Dialog open={this.state.formOpen} onClose={this.handleFormClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title"> Add a member to your team! </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Email Address"
                        type="email"
                        fullWidth
                        onChange={this.handleFormInput}
                    />
                    {this.state.errorMsg ? alert : null}
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleFormClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.handleAddMember} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>

        return form;
    }

    render() {
        const user = this.props.user;
        const teamMembers = this.state.allMembers;
        const header = <h2 style={{ marginLeft: "25px" }}>{this.props.user?.team}</h2>
        const dialog = this.getDeleteDialog();
        const users = this.getUsersCards(teamMembers, user);
        const addButton = <IconButton color="primary" className="addMember" id="addMember" onClick={this.handleFormOpen}> <AddCircleOutlineIcon /> </IconButton>
        const form = this.getAddMemberForm();
        return (
            <SideBar>
                <div id="members" style={{ marginTop: "50px" }}>
                    {header}
                    <Box
                        display="flex"
                        flexWrap="wrap"
                        p={1}
                        m={1}
                        bgcolor="background.paper"
                        css={{ maxWidth: '100%' }}
                    >
                        {users}
                        {dialog}
                        {user.role === "admin" ? addButton : null}
                        {form}
                    </Box>
                </div>
            </SideBar >
        )

    }
}

const mapStateToProps = state => ({
    user: state.user.user,
    team: state.team.team,
    error: state.error
});

export default connect(mapStateToProps, { deleteTeamMember, setUserItem, addTeamMember })(Members);
