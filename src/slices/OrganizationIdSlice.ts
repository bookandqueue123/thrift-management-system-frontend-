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

// import { User } from "@/types";
// import { createSlice } from "@reduxjs/toolkit";

// // Check if window is defined (indicating we are in a client-side environment)
// const isClient = typeof window !== "undefined";

// // Retrieve organizationId and token from localStorage, if available
// interface initialStateProps {
//   organizationId: string | null;
//   token: string | null;
//   user: User | null;
//   userId: string | null;
// }

// // Fxn to turn the user data from a JSON string to a User object
// const parseUser = (userString: string | null): User | null =>  {
//   try {
//     return userString ? JSON.parse(userString) : null;
//   } catch (error) {
//     console.error("Error parsing user data:", error);
//     return null;
//   }
// }

// const initialState: initialStateProps = {
//   organizationId: isClient
//     ? localStorage.getItem("organizationId") || null
//     : null,
//   token: isClient ? localStorage.getItem("token") || null : null,
//   user: isClient ? parseUser(localStorage.getItem("user")) || null : null,
//   userId: isClient ? localStorage.getItem("userId") || null : null,
// };




// export const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setAuthData: (state, action) => {
//       const { organizationId, token, user, userId } = action.payload;
//       state.organizationId = organizationId;
//       state.token = token;
//       state.user = user;
//       state.userId = userId;
//       // Save organizationId and token to localStorage if in client-side environment
//       if (isClient) {
//         localStorage.setItem("organizationId", organizationId);
//         localStorage.setItem("token", token);
//         localStorage.setItem("user", JSON.stringify(user));
//         localStorage.setItem("userId", userId);
//       }
//     },
//     clearAuthData: (state) => {
//       state.organizationId = null;
//       state.token = null;
//       state.user = null;
//       state.userId = null;
//       // Clear organizationId and token from localStorage if in client-side environment
//       if (isClient) {
//         localStorage.removeItem("organizationId");
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         localStorage.removeItem("userId");
//       }
//     },
//   },
// });

// export const { setAuthData, clearAuthData } = authSlice.actions;

// export const selectOrganizationId = (state: {
//   auth: { organizationId: string };
// }) => state.auth.organizationId;
// export const selectToken = (state: { auth: { token: string } }) =>
//   state.auth.token;
// export const selectUser = (state: { auth: { user: User } }) =>
//   state.auth.user;
// export const selectUserId = (state: { auth: { userId: string } }) =>
//   state.auth.userId;
// export default authSlice.reducer;

import { User } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

// Check if window is defined (indicating we are in a client-side environment)
const isClient = typeof window !== "undefined";

// Retrieve organizationId and token from localStorage, if available
interface initialStateProps {
  organizationId: string | null;
  token: string | null;
  user: User | null;
  userId: string | null;
  selectedProducts: React.Key[]; // Add selectedProducts state
}

// Function to turn the user data from a JSON string to a User object
const parseUser = (userString: string | null): User | null => {
  try {
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

const initialState: initialStateProps = {
  organizationId: isClient
    ? localStorage.getItem("organizationId") || null
    : null,
  token: isClient ? localStorage.getItem("token") || null : null,
  user: isClient ? parseUser(localStorage.getItem("user")) || null : null,
  userId: isClient ? localStorage.getItem("userId") || null : null,
  selectedProducts: [], // Initialize selectedProducts as an empty array
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData: (state, action) => {
      const { organizationId, token, user, userId, selectedProducts } = action.payload;
      state.organizationId = organizationId;
      state.token = token;
      state.user = user;
      state.userId = userId;
      state.selectedProducts = selectedProducts
      if (isClient) {
        localStorage.setItem("organizationId", organizationId);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userId", userId);
        localStorage.setItem("selectedProducts", selectedProducts)
        
      }
    },
    clearAuthData: (state) => {
      state.organizationId = null;
      state.token = null;
      state.user = null;
      state.userId = null;
      state.selectedProducts = []; // Clear selectedProducts array
      if (isClient) {
        localStorage.removeItem("organizationId");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
      }
    },
    addSelectedProduct: (state, action) => {
      const productId = action.payload;
      if (!state.selectedProducts.includes(productId)) {
        state.selectedProducts.push(productId); // Add product ID if not already included
      }
    },
    removeSelectedProduct: (state, action) => {
      const productId = action.payload;
      state.selectedProducts = state.selectedProducts.filter(
        (id) => id !== productId
      ); // Remove product ID from selectedProducts array
    },
    clearSelectedProducts: (state) => {
      state.selectedProducts = []; // Clear all selected products
    },
    updateSelectedProducts: (state, action) => {
      const productIds = action.payload;
      state.selectedProducts = productIds; // Replace the entire selectedProducts array
    },
  },
});


export const {
  setAuthData,
  clearAuthData,
  addSelectedProduct,
  removeSelectedProduct,
  clearSelectedProducts,
  updateSelectedProducts
} = authSlice.actions;

export const selectOrganizationId = (state: {
  auth: { organizationId: string };
}) => state.auth.organizationId;
export const selectToken = (state: { auth: { token: string } }) =>
  state.auth.token;
export const selectUser = (state: { auth: { user: User } }) => state.auth.user;
export const selectUserId = (state: { auth: { userId: string } }) =>
  state.auth.userId;
export const selectSelectedProducts = (state: { auth: { selectedProducts: React.Key[] } }) =>
  state.auth.selectedProducts; // Add selector for selectedProducts

export default authSlice.reducer;
