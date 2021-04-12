import axios from 'axios';
import { returnErrors } from './errorsActions';

import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    GET_USERS,
    SET_ROLE,
    SET_TEAM
} from './types';

export const loadUser = () => (dispatch, getState) => {
    dispatch({ type: USER_LOADING });

    axios.get('/auth/user', tokenConfig(getState))
        .then(res => dispatch({
            type: USER_LOADED,
            payload: res.data
        }))
        .catch(error => {
            dispatch(returnErrors(error.response.data, error.response.status));
            dispatch({ type: AUTH_ERROR })
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

export const register = ({ firstName, lastName, email, password, role, team }) => dispatch => {
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    };

    const body = { firstName, lastName, email, password, role, team };

    axios.post('/users', body, config)
        .then(res => dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        }))
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

export const login = ({ email, password, role, team }) => dispatch => {
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    };

    const body = JSON.stringify({ email, password, role, team });

    axios.post('/auth', body, config)
        .then(res => dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        }))
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
}

export const getUsers = () => dispatch => {
    axios.get('/users')
        .then(res =>
            dispatch({
                type: GET_USERS,
                payload: res.data
            })
        );
};

export const setUserRole = (_id, user) => (dispatch, getState) => {
    axios.patch(`/users/${_id}`, user, tokenConfig(getState))
        .then(res =>
            dispatch({
                type: SET_ROLE,
                payload: res.data
            })
        );
}

export const setUserTeam = (_id, user) => (dispatch, getState) => {
    axios.patch(`/users/${_id}`, user, tokenConfig(getState))
        .then(res =>
            dispatch({
                type: SET_TEAM,
                payload: res.data
            })
        );
}

