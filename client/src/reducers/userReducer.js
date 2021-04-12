import {
    USER_LOADING,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    GET_USERS,
    SET_ROLE,
    SET_TEAM
} from '../actions/types';

const initState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    userIsLoading: false,
    user: null,
    allUsers: [],
    allUsersLoading: false
};

const userReducer = (state = initState, action) => {
    switch (action.type) {
        case GET_USERS:
            return {
                ...state,
                allUsers: action.payload,
                loading: false
            };
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
        case SET_ROLE:
            return {
                ...state,
                ...action.payload

            }
        case SET_TEAM:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state;
    }
}

export default userReducer;