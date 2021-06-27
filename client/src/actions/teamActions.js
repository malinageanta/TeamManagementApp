import axios from '../axios';
import { clearErrors, returnErrors } from './errorsActions';

import {
    CREATE_TEAM,
    SET_TEAM_ITEM,
    TEAM_LOADING,
    TEAM_LOADED
} from './types';

export const getUserTeam = (team) => (dispatch, getState) => {
    let config = {
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
            dispatch(clearErrors());
            return res.data;
        })
        .catch(error => {
            dispatch(
                returnErrors(
                    error.response.data,
                    error.response.status,
                    'TEAM_LOADING_FAIL'
                )
            );
        });
};


export const createTeam = (team) => (dispatch, getState) => {
    return axios.post('/teams', team)
        .then(res => {
            dispatch({
                type: CREATE_TEAM,
                payload: res.data
            })
            dispatch(clearErrors());
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
        params: {
            itemToBeUpdated: itemToBeUpdated
        }
    }
    axios.patch(`/teams/${_id}`, { newItem }, config)
        .then(res => {
            dispatch({
                type: SET_TEAM_ITEM,
                payload: res.data
            });
        })
}

export const deleteTeamMember = (teamId, teamName, member, memberHasLeft) => (dispatch, getState) => {
    return axios.patch(`/teams/${teamId}/deleteMember`, { memberId: member, memberHasLeft })
        .then(() => {
            dispatch(getUserTeam(teamName));
        })
}

export const addTeamMember = (teamId, teamName, member) => async (dispatch, getState) => {
    return axios.patch(`/teams/${teamId}/addMember`, { memberId: member })
        .then((res) => {
            dispatch(getUserTeam(teamName));
            dispatch(clearErrors());
            return res;
        })
        .catch(error => {
            dispatch(
                returnErrors(
                    error.response.data,
                    error.response.status,
                    'ADD_MEMBER_FAIL'
                )
            );
        });
}