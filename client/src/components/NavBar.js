import React, { Component } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import logo from '../images/operry.svg';
import '../css/NavBar.css';
import { connect } from 'react-redux';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import AssignmentRoundedIcon from '@material-ui/icons/AssignmentRounded';
import GroupWorkRoundedIcon from '@material-ui/icons/GroupWorkRounded';
import Avatar from '@material-ui/core/Avatar';
import Resizer from "react-image-file-resizer";
import UploadForm from './profile/UploadForm';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { Alert } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import { logout } from '../actions/userActions';


class NavBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            formOpen: false,
            oldPassword: "",
            newPassword: ""
        }

        this.getAvatar = this.getAvatar.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.handleNewPasswordInput = this.handleNewPasswordInput.bind(this);
        this.handleOldPasswordInput = this.handleOldPasswordInput.bind(this);
        this.handleFormClose = this.handleFormClose.bind(this);
        this.handleFormOpen = this.handleFormOpen.bind(this);

    }

    async resizeFile(file) {
        return new Promise(resolve => {
            Resizer.imageFileResizer(file, 100, 100, 'PNG', 100, 0,
                uri => {
                    resolve(uri);
                }, 'base64', 100, 100);
        });
    }

    async changeHandler(e) {
        try {
            const selectedImage = e.target.files[0];
            const resizedImage = await this.resizeFile(selectedImage);

            const user = this.props.user;
            const itemToBeUpdated = 'photo';
            this.props.setUserItem(user._id, itemToBeUpdated, resizedImage, false);
        }
        catch (error) {
            console.error(error);
        }
    }




    getAvatar() {
        let image = null;
        if (this.props.user?.photo) {
            image = <Avatar alt='user_photo' src={`${this.props.user?.photo}`} id="image" className="nav-avatar" />;
        }
        else if (this.props.user) {
            const first = ((this.props.user.firstName).charAt(0)).toUpperCase();
            const last = ((this.props.user.lastName).charAt(0)).toUpperCase();
            image = <Avatar id="image" className="nav-avatar-default">{first + last}</Avatar>
        }

        return image;
    }

    handleFormOpen() {
        this.setState({
            formOpen: true
        })
    }

    handleFormClose() {
        this.setState({
            formOpen: false
        })
    }

    handleOldPasswordInput(event) {
        // this.setState({
        //     oldPassword: event.target.value
        // });
    }

    handleNewPasswordInput(event) {

    }

    handleAddMember() {
        // const team_id = this.props.team._id;
        // const team_name = this.props.team.name;
        // const newMember = this.state.memberToBeAdded;
        // this.props.addTeamMember(team_id, team_name, newMember)
        //     .then(async (res) => {
        //         await this.getAllMembers();
        //         if (res.status === 202) {
        //             this.handleFormClose();
        //             this.setState({
        //                 memberToBeAdded: ""
        //             })
        //         }
        //     })
        //     .catch(error => {
        //         console.log(error);
        //     });


    }

    getChangePasswordForm() {
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
                    // onChange={}
                    />
                    {this.state.errorMsg ? alert : null}
                </DialogContent>
                <DialogActions>
                    <Button className="add-member-submit">
                        Add
                    </Button>
                    <Button onClick={this.handleFormClose} className="add-member-cancel">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

        return form;
    }

    render() {
        let image = this.getAvatar();
        //let cp = this.getChangePasswordForm();
        return (
            <div>
                <Navbar expand="lg" style={{ paddingLeft: "7%", paddingRight: "11%" }}>
                    <Navbar.Brand href="#">
                        <img alt="Check it out" style={{ maxHeight: '24px' }} src={logo} />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarscroll" />
                    <Navbar.Collapse id="navbarscroll">
                        <Nav
                            className="mr-auto my-2 my-lg-0 nav-simple-button"
                            style={{ maxHeight: '100px', paddingLeft: '30%' }}
                            navbarscroll="true"
                        >
                            <Nav.Link href="/dashboard">
                                <div className="nav-div-center">
                                    <HomeRoundedIcon className="nav-icon" />
                                    Home
                                </div>
                            </Nav.Link>
                            <Nav.Link href="/members">
                                <div className="nav-div-center">
                                    <GroupWorkRoundedIcon className="nav-icon" />
                                    My Team
                                </div>
                            </Nav.Link>
                            <Nav.Link href="/tasks">
                                <div className="nav-div-center">
                                    <AssignmentRoundedIcon className="nav-icon" />
                                    Tasks
                                </div>
                            </Nav.Link>
                        </Nav>
                        <Nav className="nav-dropdown-button">
                            {image}
                            {/* {cp} */}
                            <NavDropdown title="" id="navbarScrollingDropdown">

                                <NavDropdown.Item>
                                    <UploadForm />
                                </NavDropdown.Item>
                                <NavDropdown.Item onClick={this.handleFormOpen}>
                                    Change password
                                </NavDropdown.Item>
                                <NavDropdown.Item onClick={this.props.logout}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                        <Nav>
                            <div style={{ color: "#294E95", fontSize: "24px", paddingLeft: "18px", paddingBottom: "4px" }} className="nav-div-center"> {this.props.user?.team} </div>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user.user
});

export default connect(mapStateToProps, { logout })(NavBar);