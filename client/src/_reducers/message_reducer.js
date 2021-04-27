import {
    SAVE_MESSAGE,
} from '../_actions/types';

export default function (state = {messages:[]}, action) {
    switch (action.type) {
        case SAVE_MESSAGE:
            return {
                ...state,
                // payload: conversation data
                messages: state.messages.concat(action.payload)
            }
        default:
            return state;
    }
}