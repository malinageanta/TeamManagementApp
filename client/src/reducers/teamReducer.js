import {
    GET_TEAM,
    CREATE_TEAM,
    DELETE_TEAM,
    ADD_MEMBER,
    DELETE_MEMBER
} from '../actions/types';

const initState = {
    team: null,
}

const teamReducer = (state = initState, action) => {
    switch (action.type) {
        case GET_TEAM:
            return {
                team: action.payload
            }
        case CREATE_TEAM:
            return {
                team: action.payload
            }
        case DELETE_TEAM:
        case ADD_MEMBER:
        case DELETE_MEMBER:
        default:
            return state;
    }
};

export default teamReducer;