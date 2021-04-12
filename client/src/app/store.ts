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
import authReducer from '../features/auth/authSlice';
import tasksReducer from '../features/tasks/tasksSlice';
import taskReducer from '../features/task/taskSlice';
import crudTaskReducer from '../features/task/crudTaskSlice';
import searchReducer from '../features/search/searchSlice';

import { LocationState } from 'history';
const historyReducer = (history: History) => ({
  router: connectRouter(history) as any as Reducer<RouterState<LocationState>>
})

const rootReducer = combineReducers({
  ...historyReducer(history),
  auth: authReducer,
  tasks: tasksReducer,
  task: taskReducer,
  crudTask: crudTaskReducer,
  search: searchReducer,
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
export type AppDispatch = typeof store.dispatch
