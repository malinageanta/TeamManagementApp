import axios from 'axios';
import { returnErrors } from './errorsActions';
import { tokenConfig } from './userActions';

import {
    GET_TEAM,
    CREATE_TEAM
} from './types';

export const getUserTeam = (team) => (dispatch, getState) => {
    let config = {
        headers: (tokenConfig(getState)).headers,
        params: {
            team: team
        }
    }
    axios.get('/teams', config)
        .then(res =>
            dispatch({
                type: GET_TEAM,
                payload: res.data
            })
        )
        .catch(error => {
            dispatch(
                returnErrors(
                    error.response.data,
                    error.response.status
                )
            );
        });
}

export const createTeam = (team) => (dispatch, getState) => {
    axios.post('/teams', team, tokenConfig(getState))
        .then(res => dispatch({
            type: CREATE_TEAM,
            payload: res.data
        })
        )
        .catch(error => {
            dispatch(
                returnErrors(
                    error.response.data,
                    error.response.status
                )
            );
        });
}