import { combineReducers } from "@reduxjs/toolkit"; 
import alert from './alert';
import authReducer from './auth'
export default combineReducers({
  alert,
  authReducer
})