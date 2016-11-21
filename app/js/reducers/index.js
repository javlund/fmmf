import {combineReducers} from 'redux';
import auth from './auth';
import members from './members';
import paypal from './paypal';

export default combineReducers({
  auth,
  members,
  paypal
});
