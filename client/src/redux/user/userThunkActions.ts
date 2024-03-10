import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import type { UserType, UserDataType, NotType } from '../../types'

export const fetchCheck = createAsyncThunk('user/get', async () => {
  const response = await axios.get<UserType>(
    `${import.meta.env.VITE_API}/v1/auth/checkSession`,
    {
      withCredentials: true,
    },
  )
  return response.data
})

export const fetchAuth = createAsyncThunk(
  'user/post',
  async ({ type, data }: { type: string; data: UserDataType }) => {
    const response = await axios.post<UserType>(
      `${import.meta.env.VITE_API}/v1/auth/${type}`,
      data,
      {
        withCredentials: true,
      },
    )
    return response.data
  },
)

export const fetchLogout = createAsyncThunk('user/logout', async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_API}/v1/auth/logout`,
    {
      withCredentials: true,
    },
  )
  if (response.status === 200)
    return {
      id: 0,
      firstName: '',
      email: '',
    }
})

export const fetchUpd = createAsyncThunk('user/upd', async (data: UserType) => {
  console.log('Мама, я в fetchUpd')
  const response = await axios.put<UserType>(
    `${import.meta.env.VITE_API}/v1/user/userUpd`,
    data,
    {
      withCredentials: true,
    },
  )
  return response.data
})

export const fetchGetNot = createAsyncThunk('user/notifications', async () => {
  const response = await axios.get<NotType>(
    `${import.meta.env.VITE_API}/v1/user/notifications`,
    { withCredentials: true },
  )
  // console.log('IN THUNK',response.data)
  return response.data
})
