import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  organizationId: null,
  token: null,
  user: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthData(state, action) {
      const { organizationId, token, user } = action.payload;
      state.organizationId = organizationId;
      state.token = token;
      state.user = user;
    },
    clearAuthData(state) {
      state.organizationId = null;
      state.token = null;
      state.user = null;
    },
  },
});

export const { setAuthData, clearAuthData } = authSlice.actions;

export default authSlice.reducer;
