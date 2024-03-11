import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import type { AdminType } from '../../types'

export const fetchCheckAdmin = createAsyncThunk('admin/get', async () => {
  const response = await axios.get<AdminType>(
    `${import.meta.env.VITE_API}/v1/admin/checkAdminSession`,
    { withCredentials: true },
  )
  return response.data
})

export const fetchAuthAdmin = createAsyncThunk(
  'admin/post',
  async (data: { password: string; login: string }) => {
    const response = await axios.post<AdminType>(
      `${import.meta.env.VITE_API}/v1/admin/log`,
      data,
      { withCredentials: true },
    )
    return response.data
  },
)

export const fetchAdminLogout = createAsyncThunk('admin/logout', async () => {
  await axios.get(`${import.meta.env.VITE_API}/v1/admin/logout`, {
    withCredentials: true,
  })
  return {
    id: 0,
    login: '',
  }
})
