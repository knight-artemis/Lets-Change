import type { ConfigureStoreOptions } from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'
import type { UserStateType } from './user/userSlice'
import userSlice from './user/userSlice'
import type { AdminInitialStateType } from './admin/adminSlice'
import adminSlice from './admin/adminSlice'
import thingSlice from './thing/thingSlice'

type StoreType = {
  userSlice: UserStateType
  adminSlice: AdminInitialStateType
  thingSlice: {isOpen: boolean}
}

const storeOptions: ConfigureStoreOptions<StoreType> = {
  reducer: {
    userSlice,
    adminSlice,
    thingSlice,
  },
}

export const store = configureStore(storeOptions)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
