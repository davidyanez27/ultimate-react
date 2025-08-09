import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
  username?: string;
  name?: string;
  email?: string;
}

interface AuthState {
  status: "checking" | "authenticated" | "not-authenticated";
  user: User;
  errorMessage?: string;
}

const initialState: AuthState = {
  status: "checking",
  user: {},
  errorMessage: undefined,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    onChecking: (state) => {
      state.status = "checking";
      state.user = {};
      state.errorMessage = undefined;
    },
    onLogin: (state, action: PayloadAction<User>) => {
      state.status = "authenticated";
      state.user = action.payload;
      state.errorMessage = undefined;
    },
    onLogout: (state, action: PayloadAction<string | undefined>) => {
      state.status = "not-authenticated";
      state.user = {};
      state.errorMessage = action.payload;
    },
    clearErrorMessage: (state) => {
      state.errorMessage = undefined;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.status = "authenticated";
    },
  },
});

export const { onChecking, onLogin, onLogout, clearErrorMessage } =
  authSlice.actions;
