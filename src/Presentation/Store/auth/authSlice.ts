import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { 
  UserDto
} from '@inventory/shared-types';

interface AuthState {
  status: "checking" | "authenticated" | "not-authenticated";
  user: UserDto; 
  errorMessage?: string;
}

const initialState: AuthState = {
  status: "checking", 
  user: {} as UserDto, 
  errorMessage: undefined,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    onChecking: (state) => {
      state.status = "checking";
      state.user = {} as UserDto;
      state.errorMessage = undefined;
    },
    onLogin: (state, action: PayloadAction<UserDto>) => {
      state.status = "authenticated";
      state.user = action.payload;
      state.errorMessage = undefined;
    },
    onLogout: (state, action: PayloadAction<string | undefined>) => {
      state.status = "not-authenticated";
      state.user = {} as UserDto;
      state.errorMessage = action.payload;
    },
    clearErrorMessage: (state) => {
      state.errorMessage = undefined;
    },
    setUser: (state, action: PayloadAction<UserDto>) => {
      state.user = action.payload;
      state.status = "authenticated";
    },
  },
});

export const { onChecking, onLogin, onLogout, clearErrorMessage, setUser } =
  authSlice.actions;
