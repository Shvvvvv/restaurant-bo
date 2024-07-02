import { post } from "@/configs/http";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLogin: false,
  loading: false,
  error: null,
  message: null,
};

export const login = post("USER_LOGIN", "auth/login");
export const createUser = post("USER_CREATE", "users/create");

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signIn: (state) => {
      state.message = "Anda berhasil login";
      state.isLogin = true;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state) => {
      state.loading = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      const res = action.payload;
      if (res.status) {
        state.isLogin = true;
        state.message = res.message;
        state.error = null;
        localStorage.setItem("user", JSON.stringify(res.data));
      } else {
        state.error = res.message;
      }
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
  },
});

export const { signIn, setLoading } = authSlice.actions;
export default authSlice.reducer;
