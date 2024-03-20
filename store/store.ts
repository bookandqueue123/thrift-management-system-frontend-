// import { configureStore } from '@reduxjs/toolkit';
// import organizationIdReducer from '../src/slices/OrganizationIdSlice'

// export const store = configureStore({
//   reducer: {
//     organizationId: organizationIdReducer,
//   },
// });

// store.js

import { configureStore } from '@reduxjs/toolkit';
import organizationIdReducer from '@/slices/OrganizationIdSlice';

export const store = configureStore({
  reducer: {
    auth: organizationIdReducer,
    // Add other reducers here if needed
  },
});
