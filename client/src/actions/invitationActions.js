import axios from 'axios';
import { returnErrors } from './errorsActions';
import { tokenConfig } from './userActions';

import {
    SEND_INVITATION,
    GET_INVITATION,
    UPDATE_INVITATION_STATE,
    DELETE_INVITATION
} from './types';

export const getInvitation = (receiver) => (dispatch, getState) => {
    let config = {
        headers: (tokenConfig(getState)).headers,
        params: {
            receiver: receiver
        }
    }
    axios.get('/invitations', config)
        .then(res =>
            dispatch({
                type: GET_INVITATION,
                payload: res.data
            })
        )
        .catch(error => {
            dispatch(
                returnErrors(
                    error.response.data,
                    error.response.status
                )
            );
        });
}

export const sendInvitation = (invitation) => (dispatch, getState) => {
    axios.post('/invitations', invitation, tokenConfig(getState))
        .then(res =>
            dispatch({
                type: SEND_INVITATION,
                payload: res.data
            })
        )
        .catch(error => {
            dispatch(
                returnErrors(
                    error.response.data,
                    error.response.status
                )
            );
        });
}

export const updateInvitationState = (_id, invitation) => (dispatch, getState) => {
    axios.patch(`/invitations/${_id}`, invitation, tokenConfig(getState))
        .then(res =>
            dispatch({
                type: UPDATE_INVITATION_STATE,
                payload: res.data
            })
        );
}

export const deleteInvitation = (_id) => (dispatch, getState) => {
    axios.delete(`/invitations/${_id}`, tokenConfig(getState))
        .then(res =>
            dispatch({
                type: DELETE_INVITATION,
                payload: res.data
            })
        );
}