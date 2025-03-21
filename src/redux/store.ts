import { configureStore } from '@reduxjs/toolkit';
import tabReducer from './tabSlice';
import themeReducer from './themeSlice';
import completionReducer from './completionSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    tab: tabReducer,
    theme: themeReducer,
    completion: completionReducer,
    user: userReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 