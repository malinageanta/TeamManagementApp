import React, { Component } from 'react';
import { connect } from 'react-redux';
import SideBar from '../SideBar';
import { Box } from '@material-ui/core';
import { getTeamTasks } from '../../actions/taskActions';
import { Alert } from '@material-ui/lab';
import { Card } from 'react-bootstrap';
import '../../css/Members.css';
import NavBar from '../NavBar';



class Tasks extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMsg: null
        }

        this.getTasksCards = this.getTasksCards.bind(this);
    }

    componentDidMount() {
        this.props.getTeamTasks(this.props.team?.members.toString());
    }

    componentDidUpdate(prevProps) {
        const { error } = this.props;
        if (error !== prevProps.error) {
            if (error.id === 'GET_TEAM_TASKS_FAIL') {
                this.setState({ errorMsg: error.msg.msg });
            }
            else {
                this.setState({ errorMsg: null });
            }
        }
    }

    getTasksCards(tasks) {
        console.log(tasks);
        if (!tasks) {
            return;
        }
        return tasks?.map((task) =>
        (
            <Box p={1}>
                <Card className="member-card">
                    <Card.Body className="member-card-body">
                        <h5>{task.name}</h5>
                    </Card.Body>
                    <Card.Footer>
                        <h5>{task.priority}</h5>
                    </Card.Footer>
                </Card>
            </Box>
        )
        )
    }

    render() {
        const header = <h2 style={{ marginLeft: "25px" }}> Tasks </h2>
        const alert = <Alert variant="outlined" severity="error"> {this.state.errorMsg} </Alert>
        return (
            <div>
                <NavBar />
                <div id="tasks">
                    {header}
                    <Box
                        display="flex"
                        flexWrap="wrap"
                        p={1}
                        m={1}
                        bgcolor="background.paper"
                        css={{ maxWidth: '100%' }}
                    >
                        {this.getTasksCards(this.props.tasks)}
                        {this.state.errorMsg ? alert : null}
                    </Box>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user.user,
    team: state.team.team,
    error: state.error,
    tasks: state.task.tasks
});

export default connect(mapStateToProps, { getTeamTasks })(Tasks);