import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/app/api/api";

interface AuthState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any | null;
  isAuth: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuth: false,
  loading: true,
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    { username, password }: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      await api.post("/auth/login", { username, password });
      return true;
    } catch {
      return rejectWithValue("Ошибка авторизации");
    }
  }
);

export const fetchMe = createAsyncThunk("auth/me", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/auth/me");
    return res.data;
  } catch {
    return rejectWithValue(null);
  }
});

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await api.post("/auth/logout");
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loginUser.fulfilled, state => {
        state.loading = false;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuth = true;
        state.loading = false;
      })
      .addCase(fetchMe.rejected, state => {
        state.user = null;
        state.isAuth = false;
        state.loading = false;
      })
      .addCase(logoutUser.fulfilled, state => {
        state.user = null;
        state.isAuth = false;
      });
  },
});

export default authSlice.reducer;
