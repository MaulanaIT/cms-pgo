import { combineReducers } from "redux";
import auth from './authSlice';
import user from './userSlice';

export default combineReducers({
  auth,
  user,
});
