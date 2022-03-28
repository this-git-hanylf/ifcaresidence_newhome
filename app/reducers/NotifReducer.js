import {actionTypes} from '../actions/NotifActions';

const initialState = {
  notifDataRed: [],
};

const notifReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.NOTIFIKASI_NBADGE:
      return {
        ...state,
      };
    case actionTypes.NOTIFIKASI_NBADGE_SUCCESS:
      return {
        ...state,
        notifDataRed: action.notifDataRed,
      };
    default:
      return state;
  }
};

export default notifReducer;
