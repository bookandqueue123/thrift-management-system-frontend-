// import { createSlice } from '@reduxjs/toolkit';

// // Retrieve organizationId from localStorage, if available
// interface stateProps{
//   value: string | null
// }
// const initialState: stateProps = {
//   value: null,
// };

// if (typeof window !== 'undefined') {
//   initialState.value = localStorage.getItem('organizationId');
// }

// export const organizationIdSlice = createSlice({
//   name: 'organizationId',
//   initialState,
//   reducers: {
//     setOrganizationId: (state, action) => {
//       state.value = action.payload;
//       // Save organizationId to localStorage
//       if (typeof window !== 'undefined') {
//         localStorage.setItem('organizationId', action.payload);
//       }
//     },
//   },
// });

// export const { setOrganizationId } = organizationIdSlice.actions;

// export const selectOrganizationId = (state: { organizationId: { value: string; }; }) => state.organizationId.value;

// export default organizationIdSlice.reducer;


// import { createSlice } from '@reduxjs/toolkit';

// // Retrieve organizationId and token from localStorage, if available
// const initialState = {
//   organizationId: localStorage.getItem('organizationId') || null,
//   token: localStorage.getItem('token') || null,
// };

// export const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     setAuthData: (state, action) => {
//       const { organizationId, token } = action.payload;
//       state.organizationId = organizationId;
//       state.token = token;
//       // Save organizationId and token to localStorage
//       localStorage.setItem('organizationId', organizationId);
//       localStorage.setItem('token', token);
//     },
//     clearAuthData: (state) => {
//       state.organizationId = null;
//       state.token = null;
//       // Clear organizationId and token from localStorage
//       localStorage.removeItem('organizationId');
//       localStorage.removeItem('token');
//     },
//   },
// });

// export const { setAuthData, clearAuthData } = authSlice.actions;

// export const selectOrganizationId = (state) => state.auth.organizationId;
// export const selectToken = (state) => state.auth.token;

// export default authSlice.reducer;


import { createSlice } from '@reduxjs/toolkit';

// Check if window is defined (indicating we are in a client-side environment)
const isClient = typeof window !== 'undefined';

// Retrieve organizationId and token from localStorage, if available
interface initialStateProps{
  organizationId: string | null,
  token: string | null
}
const initialState:initialStateProps = {
  organizationId: isClient ? localStorage.getItem('organizationId') || null : null,
  token: isClient ? localStorage.getItem('token') || null : null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthData: (state, action) => {
      const { organizationId, token } = action.payload;
      state.organizationId = organizationId;
      state.token = token;
      // Save organizationId and token to localStorage if in client-side environment
      if (isClient) {
        localStorage.setItem('organizationId', organizationId);
        localStorage.setItem('token', token);
      }
    },
    clearAuthData: (state) => {
      state.organizationId = null;
      state.token = null;
      // Clear organizationId and token from localStorage if in client-side environment
      if (isClient) {
        localStorage.removeItem('organizationId');
        localStorage.removeItem('token');
      }
    },
  },
});

export const { setAuthData, clearAuthData } = authSlice.actions;

export const selectOrganizationId = (state: { auth: { organizationId: string; }; }) => state.auth.organizationId;
export const selectToken = (state: { auth: { token: string; }; }) => state.auth.token;

export default authSlice.reducer;
