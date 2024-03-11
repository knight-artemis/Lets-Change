import { createSlice } from '@reduxjs/toolkit'
import { fetchAdminLogout, fetchCheckAdmin } from './adminThunkActions'
import type { AdminType } from '../../types'

export type AdminInitialStateType = {
  admin: { id: number; login: string }
}

const AdminInitialState: AdminInitialStateType = {
  admin: {
    id: 0,
    login: '',
  },
}

const adminSlice = createSlice({
  name: 'adminSlice',
  initialState: AdminInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchCheckAdmin.fulfilled,
      (state, { payload }: { payload: AdminType }) => {
        state.admin = payload
      },
    )

    builder.addCase(
      fetchAdminLogout.fulfilled,
      (state, { payload }: { payload: AdminType }) => {
        state.admin = payload
      },
    )
  },
})

export default adminSlice.reducer
// export const { setPosition } = userSlice.actions
