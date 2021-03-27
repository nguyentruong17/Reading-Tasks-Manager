import { configureStore, ThunkAction, Action, combineReducers, getDefaultMiddleware, Reducer } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

//history
import { connectRouter, RouterState } from 'connected-react-router';
import { History } from 'history'
import history from '../utils/history';

//reducers
import counterReducer from '../features/counter/counterSlice';
import authReducer from '../features/auth/authSlice';
import taskReducer from '../features/tasks/taskSlice';

import { LocationState } from 'history';
const historyReducer = (history: History) => ({
  router: connectRouter(history) as any as Reducer<RouterState<LocationState>>
})

const rootReducer = combineReducers({
  ...historyReducer(history),
  counter: counterReducer,
  auth: authReducer,
  task: taskReducer,
})

const persistConfig = {
  key: 'root',
  version: 1,
  storage: storage,
  // Whitelist (Save Specific Reducers)
  whitelist: [
    'auth',
    // 'settings',
  ],
}
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
    }
  })
})

// Middleware: Redux Persist Persister
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
