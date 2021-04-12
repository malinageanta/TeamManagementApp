import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SideBar from './SideBar';
import { Button } from 'react-bootstrap';
import { setUserRole, setUserTeam } from '../actions/userActions';
import { getUserTeam, createTeam } from '../actions/teamActions';



class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.handleTeamCreation = this.handleTeamCreation.bind(this);
    }
    componentDidMount() {
        console.log(this.props.user);
    }

    handleTeamCreation(e) {
        e.preventDefault();

        const user = this.props.user;
        const role = { name: "x", permissions: "" };
        const team = "";
        const newTeam = { name: "tessst123", admin: "xuleanu", members: [] };

        user.role = role;
        //this.props.setUserRole(user._id, user);
        user.team = team;
        //this.props.setUserTeam(user._id, user);
        this.props.getUserTeam(user.team);
        //this.props.createTeam(newTeam);

    }

    render() {
        return (
            <div>
                <SideBar />
                <Button variant="info" onClick={this.handleTeamCreation} style={{ height: "200px" }}>Create Team</Button>
            </div>
        )
    }

}
Dashboard.propTypes = {
    isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
    isAuthenticated: state.user.isAuthenticated,
    user: state.user.user
});

export default connect(mapStateToProps, { setUserRole, setUserTeam, getUserTeam, createTeam })(Dashboard);
