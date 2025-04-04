import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

// Import reducers
import projectReducer from './slices/projectSlice';
import photosReducer from './slices/photosSlice';
import usersReducer from './slices/usersSlice';

// Create a root reducer with all feature reducers
const rootReducer = combineReducers({
  projects: projectReducer,
  photos: photosReducer,
  users: usersReducer,
});

// Create the store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
