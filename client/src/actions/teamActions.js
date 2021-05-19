import axios from 'axios';
import { returnErrors } from './errorsActions';
import { tokenConfig } from './userActions';

import {
    CREATE_TEAM,
    SET_TEAM_ITEM,
    TEAM_LOADING,
    TEAM_LOADED
} from './types';

export const getUserTeam = (team) => (dispatch, getState) => {
    let config = {
        headers: (tokenConfig(getState)).headers,
        params: {
            team: team
        }
    }

    dispatch({ type: TEAM_LOADING });

    return axios.get('/teams', config)
        .then(res => {
            dispatch({
                type: TEAM_LOADED,
                payload: res.data
            })
            return res.data;
        })
        .catch(error => {
            dispatch(
                returnErrors(
                    error.response.data,
                    error.response.status,
                    'GET_TEAM_FAIL'
                )
            );
        });
};


export const createTeam = (team) => (dispatch, getState) => {
    return axios.post('/teams', team, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: CREATE_TEAM,
                payload: res.data
            })
            return res.data;
        }
        )
        .catch(error => {
            dispatch(
                returnErrors(
                    error.response.data,
                    error.response.status,
                    'CREATE_TEAM_FAIL'
                )
            );
        });
}

export const setTeamItem = (_id, itemToBeUpdated, newItem) => (dispatch, getState) => {
    let config = {
        headers: (tokenConfig(getState)).headers,
        params: {
            itemToBeUpdated: itemToBeUpdated
        }
    }
    axios.patch(`/teams/${_id}`, { newItem }, config)
        .then(res => {
            console.log(res)
            dispatch({
                type: SET_TEAM_ITEM,
                payload: res.data
            })
        })
}