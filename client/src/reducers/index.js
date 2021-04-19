import { combineReducers } from 'redux';
import userReducer from './userReducer';
import errorReducer from './errorReducer';
import teamReducer from './teamReducer';
import invitationReducer from './invitationReducer';

const rootReducer = combineReducers({
    user: userReducer,
    error: errorReducer,
    team: teamReducer,
    invitation: invitationReducer
});

export default rootReducer;