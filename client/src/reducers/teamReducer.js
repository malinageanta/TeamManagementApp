import {
    CREATE_TEAM,
    CREATE_TEAM_FAIL,
    SET_TEAM_ITEM,
    TEAM_LOADING,
    TEAM_LOADED,
    GET_TEAM_FAIL,
    TEAM_LOADING_FAIL
} from '../actions/types';

const initState = {
    team: null,
    teamIsLoading: true
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
        case GET_TEAM_FAIL:
            return {
                teamIsLoading: false,
                team: null
            }
        case SET_TEAM_ITEM:
            return {
                ...state,
                team: action.payload
            }
        case TEAM_LOADING_FAIL:
        default:
            return state;
    }
};

export default teamReducer;