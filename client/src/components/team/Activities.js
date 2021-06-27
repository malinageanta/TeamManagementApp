import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getState } from '../../store';
import axios from 'axios';
import { tokenConfig } from '../../actions/userActions';
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

        this.state = {
            allMembers: [],
            page: 1
        }

        this.dataLimitOnPage = 4;

        this.getAllMembers = this.getAllMembers.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    getAllMembers(getState) {
        let config = {
            headers: (tokenConfig(getState)).headers,
            params: {
                team: this.props.user?.team
            }
        }

        return axios.get('/users', config)
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

    async componentDidMount() {
        await this.getAllMembers(getState);
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
            this.props.team.activities?.map((activity, index) => {
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
            activities.map((activity) => {
                const username = <text className="username"> {activity.firstName + " " + activity.lastName} </text>;
                const email = <text className="email">{activity.email}</text>;
                const output = DateTime.fromMillis(activity.timestamp).toRelative();
                return (
                    <List style={{ width: "100%", paddingLeft: "9%", paddingRight: "9%" }}>
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                {this.getMemberIcon(activity)}
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <div>
                                        {username}
                                        {email}
                                    </div>}
                                secondary={
                                    <React.Fragment className="msg">
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            color="textPrimary"
                                        >
                                            {activity.data}
                                        </Typography>
                                        <Alert className="alert-activity" severity={activity.type}>{activity.msg}</Alert>
                                    </React.Fragment>
                                }
                            />
                            <ListItemText className="timestamp" secondary={output} />
                        </ListItem>
                        <Divider className="activities-divider" variant="inset" component="li" />
                    </List>
                )
            })
        return form;
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
        if (!this.state.allMembers.length) {
            return null;
        }
        const activities = this.createTableData(this.state.allMembers);
        const table = this.getTableOfActivities(activities);

        return (
            <div>
                {table}
                <Pagination count={Math.ceil(this.props.team.activities.length / 4)} page={this.state.page} onChange={this.handleChange} className="pagination" />
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