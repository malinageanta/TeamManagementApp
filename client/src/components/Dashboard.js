import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SideBar from './SideBar';
import { Button } from 'react-bootstrap';
import { setUserItem } from '../actions/userActions';
import { getUserTeam, createTeam } from '../actions/teamActions';
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
    }

    handleTeamCreation(e) {
        e.preventDefault();

        const user = this.props.user;
        const role = 'admin';
        const team = "";
        //const newTeam = { name: "tessst123", admin: "xuleanu", members: [] };

        user.role = role;
        let itemToBeUpdated = 'role';
        let newItem = user.role;
        this.props.setUserItem(user._id, itemToBeUpdated, newItem, false);
        user.team = team;
        //this.props.getUserTeam(user.team);
        //this.props.createTeam(newTeam);

    }

    render() {

        return (
            <div>
                <SideBar />
            </div>
        )
    }

}
Dashboard.propTypes = {
    isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
    user: state.user.user
});

export default connect(mapStateToProps,
    {
        setUserItem, getUserTeam, createTeam
    }
)(Dashboard);
