import { GET_USERS, USERS_LOADING } from '../actions/types';

const initState = {
    users: [],
    loading: true
}

const userReducer = (state = initState, action) => {
    switch (action.type) {
        case GET_USERS:
            return {
                ...state,
                users: action.payload,
                loading: false
            };
        case USERS_LOADING:
            return {
                ...state,
                loading: true
            }
        default:
            return state;
    }
};

export default userReducer;