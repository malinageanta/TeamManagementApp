import {
    GET_TEAM_TASKS,
} from '../actions/types';

const initState = {
    tasks: []
}

const taskReducer = (state = initState, action) => {
    switch (action.type) {
        case GET_TEAM_TASKS:
            return {
                tasks: action.payload
            }
        default:
            return state;
    }
};

export default taskReducer;