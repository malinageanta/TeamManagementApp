import {
    USER_LOADING,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    SET_USER_ITEM
} from '../actions/types';

const initState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    userIsLoading: false,
    user: null,
    allUsersLoading: false
};

const userReducer = (state = initState, action) => {
    switch (action.type) {
        case USER_LOADING:
            return {
                ...state,
                userIsLoading: true
            };
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                userIsLoading: false,
                user: action.payload
            };
        case LOGIN_SUCCESS:
        case REGISTER_SUCCESS:
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                userIsLoading: false
            };
        case LOGIN_FAIL:
        case REGISTER_FAIL:
        case LOGOUT_SUCCESS:
        case AUTH_ERROR:
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                user: null,
                isAuthenticated: false,
                userIsLoading: false
            };
        case SET_USER_ITEM:
            return {
                ...state,
                user: action.payload
            }
        default:
            return state;
    }
}

export default userReducer;