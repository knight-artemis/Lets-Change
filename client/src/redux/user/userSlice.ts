import { createSlice } from '@reduxjs/toolkit'
import type { UserType } from '../../types'
import { fetchAuth, fetchCheck, fetchLogout, fetchUpd } from './userThunkActions'
import useGeoLocation from '../../hooks/useGeoLocation'

export type UserStateType = {
  user: UserType
  pos: number[]
}

export const initialUser: UserType = {
  id: 0,
  firstName: '',
  email: '',
}

const UserInitialState: UserStateType = {
  user: initialUser,
  pos: [],
}

const userSlice = createSlice({
  name: 'userSlice',
  initialState: UserInitialState,
  reducers: {
    setPosition(state, { payload }: { payload: number[] }) {
      console.log('PAYLOAD', payload)
      state.pos = payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchCheck.fulfilled,
      (state, { payload }: { payload: UserType }) => {
        state.user = payload
      },
    )

    builder.addCase(
      fetchAuth.fulfilled,
      (state, { payload }: { payload: UserType }) => {
        state.user = payload
      },
    )

    builder.addCase(fetchLogout.fulfilled, (state) => {
      state.user = initialUser
    })

    builder.addCase(
      fetchUpd.fulfilled,
      (state, { payload }: { payload: UserType }) => {
        state.user = payload
      },
    )
  },
})

export default userSlice.reducer
export const { setPosition } = userSlice.actions
