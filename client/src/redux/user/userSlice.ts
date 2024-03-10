import { createSlice } from '@reduxjs/toolkit'
import type { NotType, UserType } from '../../types'
import {
  fetchAuth,
  fetchCheck,
  fetchGetNot,
  fetchLogout,
  fetchUpd,
} from './userThunkActions'
import useGeoLocation from '../../hooks/useGeoLocation'

export type UserStateType = {
  user: UserType
  pos: number[]
  notifications: NotType
}

export const initialUser: UserType = {
  id: 0,
  firstName: '',
  email: '',
}

const initialNot: NotType = {
    initiator: 0,
    reciever: 0,
}

const UserInitialState: UserStateType = {
  user: initialUser,
  pos: [],
  notifications: initialNot
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

    builder.addCase(fetchGetNot.fulfilled, (state, { payload }) => {
      state.notifications = payload
    })
  },
})

export default userSlice.reducer
export const { setPosition } = userSlice.actions
