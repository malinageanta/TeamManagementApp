import { SEND_INVITATION, GET_INVITATION, UPDATE_INVITATION_STATE, DELETE_INVITATION } from '../actions/types';

const initState = {
    invitations: [],
}

const invitationReducer = (state = initState, action) => {
    switch (action.type) {
        case SEND_INVITATION:
            return {
                invitations: [...state.invitations, action.payload]
            }
        case GET_INVITATION:
            return {
                invitations: action.payload
            }
        case UPDATE_INVITATION_STATE:
            return {
                invitations: [...state.invitations, action.payload]
            }
        case DELETE_INVITATION:
            return {
                invitations: state.invitations.filter(invitation => invitation._id !== action.payload._id)
            }
        default:
            return state;
    }
};

export default invitationReducer;