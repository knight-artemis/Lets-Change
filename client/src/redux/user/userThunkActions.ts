import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { UserType, UserDataType } from '../../types';

export const fetchCheck = createAsyncThunk('user/get', async () => {
  const response = await axios.get<UserType>(
    `${import.meta.env.VITE_URL}/v1/auth/check_session`,
    {
      withCredentials: true,
    },
  );
  return response.data;
});

export const fetchAuth = createAsyncThunk(
  'user/post',
  async ({ type, data }: { type: string; data: UserDataType }) => {
    const response = await axios.post<UserType>(
      `${import.meta.env.VITE_URL}/v1/auth/${type}`,
      data,
      {
        withCredentials: true,
      },
    );
    return response.data;
  },
);

export const fetchLogout = createAsyncThunk('user/logout', async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_URL}/v1/auth/logout`,
    {
      withCredentials: true,
    },
  );
  if (response.status === 200)
    return {
      id: 0,
      firstName: '',
      email: '',
    };
});
