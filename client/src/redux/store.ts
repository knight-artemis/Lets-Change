import type { ConfigureStoreOptions } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import type { UserStateType } from './user/userSlice';
import userSlice from './user/userSlice';

type StoreType = {
  userSlice: UserStateType;
};

const storeOptions: ConfigureStoreOptions<StoreType> = {
  reducer: {
    userSlice,
  },
};

export const store = configureStore(storeOptions);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
