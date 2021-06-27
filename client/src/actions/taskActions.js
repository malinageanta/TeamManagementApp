import axios from '../axios';
import { clearErrors, returnErrors } from './errorsActions';

import {
    GET_TEAM_TASKS
} from './types';


export const getTeamTasks = (team) => (dispatch, getState) => {
    let config = {
        params: {
            team: team
        }
    }
    return axios.get('/tasks/usersWithTasks', config)
        .then(res => {
            dispatch({
                type: GET_TEAM_TASKS,
                payload: res.data
            })
            return res.data;
        })
};

export const createTask = (task) => (dispatch, getState) => {
    return axios.post('/tasks', task)
        .then((res) => {
            dispatch(getTeamTasks(task.currentTeam.members));
            dispatch(clearErrors());
            return res.status;
        })
        .catch(error => {
            dispatch(
                returnErrors(
                    error.response.data,
                    error.response.status,
                    'CREATE_TASK_FAIL'
                )
            );
        });
}

export const setTaskItems = (_id, newItem, team) => (dispatch, getState) => {
    axios.patch(`/tasks/${_id}`, { newItem, team })
        .then((res) => {
            dispatch(getTeamTasks(team));
        })
}

export const deleteTask = (taskId, team) => (dispatch, getState) => {
    let config = {
        team: team
    }
    axios.delete(`/tasks/${taskId}`, config)
        .then((res) => {
            dispatch(getTeamTasks(team));
        })
}
