import { combineReducers } from 'redux';
import userReducer from './userReducer';
import errorReducer from './errorReducer';
import teamReducer from './teamReducer';

const rootReducer = combineReducers({
    user: userReducer,
    error: errorReducer,
    team: teamReducer
});

export default rootReducer;