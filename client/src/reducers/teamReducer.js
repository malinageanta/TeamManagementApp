import {
    CREATE_TEAM,
    DELETE_TEAM,
    ADD_MEMBER,
    DELETE_MEMBER,
    CREATE_TEAM_FAIL,
    SET_TEAM_ITEM,
    TEAM_LOADING,
    TEAM_LOADED,
    GET_TEAM_FAIL
} from '../actions/types';

const initState = {
    team: null,
    teamIsLoading: false
}

const teamReducer = (state = initState, action) => {
    switch (action.type) {
        case TEAM_LOADING:
            return {
                ...state,
                teamIsLoading: true
            };
        case TEAM_LOADED:
            return {
                ...state,
                teamIsLoading: false,
                team: action.payload
            };
        case CREATE_TEAM:
            return {
                ...state,
                teamIsLoading: false,
                team: action.payload
            }
        case CREATE_TEAM_FAIL:
        case DELETE_TEAM:
        case GET_TEAM_FAIL:
        case SET_TEAM_ITEM:
            return {
                ...state,
                team: action.payload
            }
        case ADD_MEMBER:
        case DELETE_MEMBER:
        default:
            return state;
    }
};

export default teamReducer;