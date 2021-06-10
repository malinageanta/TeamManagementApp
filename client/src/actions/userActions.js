import axios from 'axios';
import { clearErrors, returnErrors } from './errorsActions';
import { getUserTeam } from './teamActions';

import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    SET_USER_ITEM,
    GET_TEAM_FAIL
} from './types';

export const loadUser = () => (dispatch, getState) => {
    dispatch({ type: USER_LOADING });

    return axios.get('/auth/user', tokenConfig(getState))
        .then(res => {
            dispatch({
                type: USER_LOADED,
                payload: res.data
            })
            dispatch(getUserTeam(res.data.team));
            dispatch(clearErrors());
        })
        .catch(error => {
            dispatch(returnErrors(error?.response?.data, error?.response?.status));
            dispatch({ type: AUTH_ERROR })
            dispatch({ type: GET_TEAM_FAIL })
        });

};

export const tokenConfig = getState => {
    const token = getState().user.token;

    const config = {
        headers: {
            "Content-type": "application/json"
        }
    };

    if (token) {
        config.headers['x-auth-token'] = token;
    }

    return config;
};

export const register = ({ firstName, lastName, email, password, role, team, photo }) => dispatch => {
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    };

    const body = { firstName, lastName, email, password, role, team, photo };

    axios.post('/users', body, config)
        .then(res => {
            dispatch({ type: REGISTER_SUCCESS, payload: res.data });
            dispatch(getUserTeam(res.data.user.team));
            dispatch(clearErrors());
        })
        .catch(error => {
            dispatch(
                returnErrors(
                    error.response.data,
                    error.response.status,
                    'REGISTER_FAIL'
                ));
            dispatch({ type: REGISTER_FAIL });
        });
};

export const login = ({ email, password, role, team, photo }) => dispatch => {
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    };

    const body = JSON.stringify({ email, password, role, team, photo });

    axios.post('/auth', body, config)
        .then(res => {
            dispatch({ type: LOGIN_SUCCESS, payload: res.data });
            dispatch(getUserTeam(res.data.user.team));
            dispatch(clearErrors());
        })
        .catch(error => {
            dispatch(
                returnErrors(
                    error.response.data,
                    error.response.status,
                    'LOGIN_FAIL'
                ));
            dispatch({ type: LOGIN_FAIL });
        });
}

export const logout = () => dispatch => {
    dispatch({ type: LOGOUT_SUCCESS });
    dispatch({ type: GET_TEAM_FAIL });
}

export const setUserItem = (_id, itemToBeUpdated, newItem, isOtherUser) => (dispatch, getState) => {
    let config = {
        headers: (tokenConfig(getState)).headers,
        params: {
            itemToBeUpdated: itemToBeUpdated
        }
    }
    return axios.patch(`/users/${_id}`, { newItem }, config)
        .then(res => {
            if (!isOtherUser) {
                dispatch({
                    type: SET_USER_ITEM,
                    payload: res.data
                })
            }
        })
}

