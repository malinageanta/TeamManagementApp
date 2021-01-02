import { combineReducers } from 'redux';
import userReducer from './userReducer';
import errorReducer from './errorReducer';
import authReducer from './authReducer';

const rootReducer = combineReducers({
    user: userReducer,
    error: errorReducer,
    auth: authReducer
});

export default rootReducer;