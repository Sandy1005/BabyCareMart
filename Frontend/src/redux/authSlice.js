import { createSlice } from "@reduxjs/toolkit";

const savedUser = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: savedUser || null,
  isAuthenticated: !!savedUser,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },

    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;

      localStorage.setItem("user", JSON.stringify(action.payload));
    },

    loginFailure: (state) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;

      localStorage.removeItem("user");
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;

      localStorage.removeItem("user");
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
} = authSlice.actions;

export default authSlice.reducer;