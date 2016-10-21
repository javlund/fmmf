import {combineReducers} from 'redux';
import auth from './auth';
import members from './members';

export default combineReducers({
  auth,
  members
});
