import { IconButton, Avatar, TextField } from '@material-ui/core';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../../css/Members.css';
import axios from '../../axios';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { deleteTeamMember, addTeamMember } from '../../actions/teamActions';
import { setUserItem } from '../../actions/userActions';
import { Alert } from '@material-ui/lab';
import NavBar from '../NavBar';
import { DataGrid } from '@material-ui/data-grid';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { getState } from '../../store';



class Members extends Component {
    constructor(props) {
        super(props);

        this.state = {
            allMembers: [],
            dialogOpen: false,
            memberToBeDeleted: "",
            formOpen: false,
            memberToBeAdded: "",
            errorMsg: null,
        }

        this.isCancelled = false;

        this.getMemberInfo = this.getMemberInfo.bind(this);
        this.getMemberIcon = this.getMemberIcon.bind(this);
        this.handleMemberDelete = this.handleMemberDelete.bind(this);
        this.handleDialogClose = this.handleDialogClose.bind(this);
        this.handleDialogOpen = this.handleDialogOpen.bind(this);
        this.getMemberDeleteButton = this.getMemberDeleteButton.bind(this);
        this.getAllMembers = this.getAllMembers.bind(this);
        this.handleAddMember = this.handleAddMember.bind(this);
        this.handleFormClose = this.handleFormClose.bind(this);
        this.handleFormOpen = this.handleFormOpen.bind(this);
        this.handleFormInput = this.handleFormInput.bind(this);
        this.getAddMemberForm = this.getAddMemberForm.bind(this);
        this.getTableOfMembers = this.getTableOfMembers.bind(this);
        this.createTableData = this.createTableData.bind(this);

    }

    componentDidMount() {
        this.getAllMembers(getState);
    }

    componentDidUpdate(prevProps) {
        const { error } = this.props;
        if (error !== prevProps.error && !this.isCancelled) {
            if (error.id === 'ADD_MEMBER_FAIL') {
                this.setState({ errorMsg: error.msg.msg });
            }
            else {
                this.setState({ errorMsg: null });
            }
        }
    }

    componentWillUnmount() {
        this.isCancelled = true;
    }

    getAllMembers(getState) {
        let config = {
            params: {
                team: this.props.user?.team
            }
        }

        return axios.get('/users', config)
            .then(res => {
                if (!this.isCancelled) {
                    this.setState({
                        allMembers: res.data
                    })
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    getMemberIcon(member) {
        let image = null;
        if (member.photo) {
            image = <Avatar alt='user_photo' src={`${member.photo}`} className="nav-avatar" />
        }
        else {
            const first = ((member.firstName).charAt(0)).toUpperCase();
            const last = ((member.lastName).charAt(0)).toUpperCase();
            image = <Avatar className="nav-avatar-default">{first + last}</Avatar>
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
        var text = isCurrentUser ? "Leave" : "Remove";

        button =
            <Button size="small" color="secondary" startIcon={<DeleteIcon />} disabled={disabledState} onClick={() => this.handleDialogOpen(member)}>
                {text}
            </Button>

        return button;
    }

    getDeleteDialog() {
        const msg = this.props.user.role === 'admin' ? "Are you sure you want to leave this team?" : "Are you sure you want to remove this member?"
        return <Dialog
            open={this.state.dialogOpen}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title" style={{ color: "#294E95" }}>{msg}</DialogTitle>
            <DialogActions>
                <Button onClick={this.handleMemberDelete} className="add-member-submit" autoFocus>
                    Yes
                </Button>
                <Button onClick={this.handleDialogClose} className="add-member-cancel">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    }

    handleDialogClose() {
        if (!this.isCancelled) {
            this.setState({
                dialogOpen: false
            })
        }
    }

    handleDialogOpen(member) {
        if (!this.isCancelled) {
            this.setState({
                dialogOpen: true,
                memberToBeDeleted: member
            })
        }
    }


    handleMemberDelete() {
        const memberHasLeft = this.props.user.role === 'admin'
        const team_id = this.props.team._id;
        const team_name = this.props.team.name;
        const user_id = this.state.memberToBeDeleted._id;
        this.props.deleteTeamMember(team_id, team_name, this.state.memberToBeDeleted.email, memberHasLeft)
            .then(() => {
                this.props.setUserItem(user_id, 'team', "", this.props.user._id !== user_id)
                    .then(async () => {
                        await this.getAllMembers(getState);
                        this.handleDialogClose();
                    })
            })
    }

    createTableData(teamMembers, user) {
        const dataArray = teamMembers?.map((member, index) => {
            return {
                _id: member._id,
                id: index + 1,
                photo: member.photo,
                firstName: member.firstName,
                lastName: member.lastName,
                email: member.email,
                role: member.role
            }
        })
        return dataArray
    }

    handleFormClose() {
        this.setState({
            formOpen: false,
            errorMsg: null
        })
    }

    handleFormOpen() {
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
                <DialogTitle id="form-dialog-title" style={{ color: "#294E95" }}> Add a member to your team! </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Email Address"
                        type="email"
                        fullWidth
                        className="add-member-input"
                        onChange={this.handleFormInput}
                    />
                    {this.state.errorMsg ? alert : null}
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleAddMember} className="add-member-submit">
                        Add
                    </Button>
                    <Button onClick={this.handleFormClose} className="add-member-cancel">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

        return form;
    }

    getTableOfMembers() {
        const addButton = <IconButton color="primary" className="addMember" id="addMember" onClick={this.handleFormOpen}> <AddCircleOutlineIcon /> </IconButton>
        const rows = this.createTableData(this.state?.allMembers, this.props?.user);
        const columns = [
            { field: 'id', headerName: 'ID', type: 'number', width: 100 },
            {
                field: 'picture', filterable: false, sortable: false, headerName: 'Picture', width: 130, renderCell: (params) => {
                    return this.getMemberIcon(params.row);
                }
            },
            { field: 'firstName', headerName: 'First name', width: 210 },
            { field: 'lastName', headerName: 'Last name', width: 210 },
            { field: 'email', headerName: 'Email', width: 300 },
            { field: 'role', headerName: 'Role', width: 110 },
            {
                field: 'delete', filterable: false, sortable: false, headerName: 'Delete', width: 120, renderCell: (params) => {
                    return this.getMemberDeleteButton(this.props.user, params.row);
                }
            },
            this.props.user.role === "admin" ? { field: 'add', filterable: false, sortable: false, width: 100, renderHeader: () => addButton } : {}
        ]

        const table = <div style={{ height: 500, width: '100%', paddingTop: "30px" }}>
            <DataGrid rows={rows} columns={columns} pageSize={6} hideFooterSelectedRowCount={true} />
        </div>

        return table;
    }

    render() {
        if (!this.props.user?.team) {
            return <div></div>
        }
        const table = this.getTableOfMembers();
        const dialog = this.getDeleteDialog();
        const form = this.getAddMemberForm();
        return (

            <div>
                <NavBar />
                {table}
                {dialog}
                {form}
            </div>
        )

    }
}

const mapStateToProps = state => ({
    user: state.user.user,
    team: state.team.team,
    error: state.error
});

export default connect(mapStateToProps, { deleteTeamMember, setUserItem, addTeamMember })(Members);
