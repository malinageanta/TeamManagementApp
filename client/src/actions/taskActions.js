import axios from 'axios';
import { clearErrors, returnErrors } from './errorsActions';
import { tokenConfig } from './userActions';

import {
    GET_TEAM_TASKS
} from './types';


export const getTeamTasks = (teamMembers) => (dispatch, getState) => {
    let config = {
        headers: (tokenConfig(getState)).headers,
        params: {
            members: teamMembers
        }
    }

    return axios.get('/tasks', config)
        .then(res => {
            dispatch({
                type: GET_TEAM_TASKS,
                payload: res.data
            })
            dispatch(clearErrors());
            return res.data;
        })
        .catch(error => {
            dispatch(
                returnErrors(
                    error.response.data,
                    error.response.status,
                    'GET_TEAM_TASKS_FAIL'
                )
            );
        });
};

export const createTask = (task) => (dispatch, getState) => {
    return axios.post('/tasks', task, tokenConfig(getState))
        .then(() => {
            dispatch(clearErrors());
            dispatch(getTeamTasks(task.currentTeam.members));
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

export const setTaskItem = (_id, itemToBeUpdated, newItem, teamMembers) => (dispatch, getState) => {
    let config = {
        headers: (tokenConfig(getState)).headers,
        params: {
            itemToBeUpdated: itemToBeUpdated
        }
    }
    axios.patch(`/tasks/${_id}`, { newItem }, config)
        .then(() => {
            dispatch(getTeamTasks(teamMembers));
        })
}

export const deleteTask = (taskId, teamMembers) => (dispatch, getState) => {
    return axios.delete(`/teams/${taskId}`, tokenConfig(getState))
        .then(() => {
            dispatch(getTeamTasks(teamMembers));
        })
}
