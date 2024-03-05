import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import type { TodoDataType, TodoInputsType, TodoType, UserDataType, UserType } from '../types';

export const fetchTodos = createAsyncThunk('todos/all', async () => {
  const response = await axios.get<AxiosResponse<TodoType[]>>(`${import.meta.env.VITE_URL}/todos`);
  return response.data;
});

export const fetchAddTodo = createAsyncThunk('todos/post', async (inputs: TodoInputsType) => {
  const response = await axios.post<TodoInputsType, AxiosResponse<TodoType>>(`${import.meta.env.VITE_URL}/todos`, inputs);
  return response.data;
});

export const fetchDelTodo = createAsyncThunk('todos/del', async (id: number) => {
  const response = await axios.delete(`${import.meta.env.VITE_URL}/todos/${id}`);
  if (response.status === 200) return id;
});

export const fetchPatchTodo = createAsyncThunk(
  'todos/patch',
  async ({ id, data }: { id: number; data: TodoDataType }) => {
    const response = await axios.patch<TodoDataType, AxiosResponse<TodoType>>(`${import.meta.env.VITE_URL}/todos/${id}`, data);
    return response.data;
  },
);

export const fetchAuth = createAsyncThunk(
  'user/post',
  async ({ type, data }: { type: string; data: UserDataType }) => {
    const response = await axios.post<UserDataType, AxiosResponse<UserType>>(
      `${import.meta.env.VITE_URL}/users/${type}`,
      data,
      {
        withCredentials: true,
      },
    );
    return response.data;
  },
);

export const fetchLogout = createAsyncThunk('user/logout', async () => {
  const response = await axios.get(`${import.meta.env.VITE_URL}/users/logout`, {
    withCredentials: true,
  });
  if (response.status === 200) return;
});
