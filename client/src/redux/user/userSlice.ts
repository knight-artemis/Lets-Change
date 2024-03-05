import { createSlice } from '@reduxjs/toolkit';
import type { UserType } from '../../types';
import { fetchAuth, fetchCheck, fetchLogout } from './userThunkActions';

export type UserStateType = {
  user: UserType;
};

export const initialUser: UserType = {
  id: 0,
  firstName: '',
  email: '',
};

const UserInitialState: UserStateType = {
  user: initialUser,
};

const userSlice = createSlice({
  name: 'userSlice',
  initialState: UserInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchCheck.fulfilled,
      (state, { payload }: { payload: UserType }) => {
        state.user = payload;
      },
    );

    builder.addCase(
      fetchAuth.fulfilled,
      (state, { payload }: { payload: UserType }) => {
        state.user = payload;
      },
    );

    builder.addCase(fetchLogout.fulfilled, (state) => {
      state.user = initialUser;
    });
  },
});

export default userSlice.reducer;
