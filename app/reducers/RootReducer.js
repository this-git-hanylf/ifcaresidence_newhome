import {combineReducers} from 'redux';
import error from './ErrorReducer';
import user from './UserReducer';
import status from './StatusReducer';
import AuthReducer from './auth';
import ApplicationReducer from './application';
import notifDataRed from './NotifReducer';

const rootReducer = combineReducers({
  error,
  user,
  status,
  auth: AuthReducer,
  application: ApplicationReducer,
  notifDataRed,
});

export default rootReducer;
