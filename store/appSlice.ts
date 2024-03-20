import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Add other application state variables here
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    // Add reducers for application state changes
  },
});

export default appSlice.reducer;
