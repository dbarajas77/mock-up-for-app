import { combineReducers } from '@reduxjs/toolkit';
import { projectReducer } from './projectReducer';

export const rootReducer = combineReducers({
  projects: projectReducer,
  // Add other reducers here as needed
}); 