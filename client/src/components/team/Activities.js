import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getState } from '../../store';
import axios from '../../axios';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import '../../css/Activities.css';
import { Alert } from '@material-ui/lab';
import { DateTime } from "luxon";
import Pagination from '@material-ui/lab/Pagination';


class Activities extends Component {
    constructor(props) {
        super(props);
        this.isCancelled = false;
        this.state = {
            allMembers: [],
            page: 1
        }

        this.dataLimitOnPage = 5;

        this.getAllMembers = this.getAllMembers.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    async getAllMembers(getState) {
        let config = {
            params: {
                team: this.props.user?.team
            }
        }

        const res = await axios.get('/users', config)
        if (!this.isCancelled) {
            this.setState({
                allMembers: res.data
            });
        }
    }

    async componentDidMount() {
        await this.getAllMembers(getState);
    }

    componentWillUnmount() {
        this.isCancelled = true;
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

    createTableData(teamMembers) {
        const dataArray =
            this.props.team.activities?.filter(x => teamMembers.find((y) => {
                return y.email === x.name
            }))
                .map((activity, index) => {
                    var member = teamMembers.find((x) => {
                        return x.email === activity.name
                    })

                    return {
                        id: index + 1,
                        photo: member.photo,
                        firstName: member.firstName,
                        lastName: member.lastName,
                        timestamp: activity.timestamp,
                        msg: activity.msg,
                        email: activity.name,
                        type: activity.type
                    }
                })
        return dataArray.reverse();
    }


    getTableOfActivities(activities) {
        activities = this.getPaginatedData(activities);
        const form =
            activities.map((activity, index) => {
                const username = <span className="username"> {activity.firstName + " " + activity.lastName} </span>;
                const email = <span className="email">{activity.email}</span>;
                const output = DateTime.fromMillis(activity.timestamp).toRelative();
                return (
                    <div key={index}>
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                {this.getMemberIcon(activity)}
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <span>
                                        {username}
                                        {email}
                                    </span>}
                                secondary={
                                    <React.Fragment>
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            color="textPrimary"
                                            className="msg"
                                        >
                                            {activity.data}
                                        </Typography>
                                    </React.Fragment>
                                }
                            />
                            <ListItemText className="timestamp" secondary={output} />
                        </ListItem>
                        <Alert className="alert-activity" severity={activity.type}>{activity.msg}</Alert>
                        <Divider className="activities-divider" variant="inset" component="li" />
                    </div>
                )
            })

        return <List style={{
            width: "100%", paddingLeft: "9%", paddingRight: "9%", minHeight: '80vh'
        }
        }> {form} </List >;
    }

    handleChange(event, value) {
        this.setState({
            page: value
        })
    };

    getPaginatedData(data) {
        const startIndex = this.state.page * this.dataLimitOnPage - this.dataLimitOnPage;
        const endIndex = startIndex + this.dataLimitOnPage;
        return data.slice(startIndex, endIndex);
    };


    render() {
        if (!this.state.allMembers?.length) {
            return null;
        }
        const activities = this.createTableData(this.state.allMembers);
        const table = this.getTableOfActivities(activities);

        return (
            <div>
                {table}
                <Pagination count={Math.ceil(this.props.team.activities.length / this.dataLimitOnPage)} page={this.state.page} onChange={this.handleChange} className="pagination" />
            </div>
        )
    }
}


const mapStateToProps = (state) => ({
    user: state.user.user,
    error: state.error,
    team: state.team.team
});

export default connect(mapStateToProps)(Activities);