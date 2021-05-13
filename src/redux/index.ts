import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { save, load } from 'redux-localstorage-simple'

import { updateVersion } from './global/actions'
import application from './application/reducer'
import user from './user/reducer'

const PERSISTED_KEYS: string[] = ['user']

const store = configureStore({
  reducer: {
    application,
    user,
  },
  // @ts-ignore
  middleware: [...getDefaultMiddleware({ thunk: false }), save({ states: PERSISTED_KEYS })],
  preloadedState: load({ states: PERSISTED_KEYS })
})

store.dispatch(updateVersion())

export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
