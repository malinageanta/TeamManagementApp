import { combineReducers } from 'redux';
import userReducer from './userReducer';
import errorReducer from './errorReducer';
import teamReducer from './teamReducer';
import taskReducer from './taskReducer';

const rootReducer = combineReducers({
    user: userReducer,
    error: errorReducer,
    team: teamReducer,
    task: taskReducer
});

export default rootReducer;