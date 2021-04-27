import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SideBar from './SideBar';
import { Button } from 'react-bootstrap';
import { setUserItem } from '../actions/userActions';
import { getUserTeam, createTeam } from '../actions/teamActions';
import { sendInvitation, getInvitation, updateInvitationState, deleteInvitation } from '../actions/invitationActions';
import { Avatar } from '@material-ui/core';
import '../css/Drawer.css';



class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.handleTeamCreation = this.handleTeamCreation.bind(this);
    }
    componentDidMount() {
        // const user = this.props.user;
        // this.props.getUserTeam(user.team);
        // const newInvitation = { sender: user.email, receiver: "tessst@gmail.com" };
        // this.props.getInvitation(newInvitation.receiver);
    }

    handleTeamCreation(e) {
        e.preventDefault();

        const user = this.props.user;
        const role = 'admin';
        const team = "";
        //const newTeam = { name: "tessst123", admin: "xuleanu", members: [] };
        //const newInvitation = { sender: user.email, receiver: "tessst@gmail.com" };

        user.role = role;
        let itemToBeUpdated = 'role';
        let newItem = user.role;
        console.log(user);
        this.props.setUserItem(user._id, itemToBeUpdated, newItem);
        user.team = team;
        //this.props.getUserTeam(user.team);
        //this.props.createTeam(newTeam);
        //this.props.sendInvitation(newInvitation);
        //const invitations = this.props.invitations;
        //invitations[0].state = "rejected";
        //this.props.updateInvitationState(invitations[0]._id, invitations[0]);
        // this.props.deleteInvitation(invitations[0]._id);

    }

    render() {
        let image = null;
        if (this.props.user.photo) {
            image = <Avatar alt='user_photo' src={`${this.props.user.photo}`} id="image" className="icon" />;
        }
        else {
            const first = ((this.props.user.firstName).charAt(0)).toUpperCase();
            const last = ((this.props.user.lastName).charAt(0)).toUpperCase();
            image = <Avatar id="image" className="icon-default">{first + last}</Avatar>
        }
        return (
            <div>
                <SideBar>
                    {image}
                    <Button variant="info" style={{ height: "200px" }} id="button">Create Team</Button>
                </SideBar>
            </div>
        )
    }

}
Dashboard.propTypes = {
    isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
    user: state.user.user,
    invitations: state.invitation.invitations
});

export default connect(mapStateToProps,
    {
        setUserItem, getUserTeam, createTeam, sendInvitation,
        getInvitation, updateInvitationState, deleteInvitation
    }
)(Dashboard);
