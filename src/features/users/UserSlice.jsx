// src/features/user/UserSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null,
  name: null,
  token: null,
  photo: null,
  status: 'idle',
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setId: (state, action) => {
      state.id = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUserLogin: (state, action) => {
      state.name = action.payload.name;
      state.id = action.payload.id;
      state.token = action.payload.token;
      state.photo = action.payload.photo;
  },
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      state.name = null;
      state.photo = null;
    },
  },
});

export const { setId, setName, setToken, clearUser, setUserLogin } = userSlice.actions;

export const selectUser = (state) => state.user.user;
export const selectName = (state) => state.user.name;
export const selectToken = (state) => state.user.token;
export const selectPhoto = (state) => state.user.photo;

export default userSlice.reducer;
