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
  //  selectedProducts: isClient
  //      ? JSON.parse(localStorage.getItem("selectedProducts") || "[]")
  //      : [], // Initialize from localStorage or an empty array
  // selectedProducts: isClient
  //   ? JSON.parse(localStorage.getItem("selectedProducts") || "[]")
  //   : [], // Initialize from localStorage or an empty array

  selectedProducts: isClient
    ? (() => {
        try {
          const storedProducts = localStorage.getItem("selectedProducts");
          if (!storedProducts || storedProducts === "undefined") return [];
          return JSON.parse(storedProducts);
        } catch (error) {
          console.error(
            "Error parsing selectedProducts from localStorage",
            error,
          );
          return [];
        }
      })()
    : [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData: (state, action) => {
      const { organizationId, token, user, userId, selectedProducts } =
        action.payload;
      state.organizationId = organizationId;
      state.token = token;
      state.user = user;
      state.userId = userId;
      state.selectedProducts = selectedProducts;
      if (isClient) {
        localStorage.setItem("organizationId", organizationId);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userId", userId);
        localStorage.setItem("selectedProducts", JSON.stringify(selectedProducts));
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
        state.selectedProducts.push(productId);
        if (isClient) {
          localStorage.setItem(
            "selectedProducts",
            JSON.stringify(state.selectedProducts),
          );
        }
      }
    },
    removeSelectedProduct: (state, action) => {
      const productId = action.payload;
      state.selectedProducts = state.selectedProducts.filter(
        (id) => id !== productId,
      );
      if (isClient) {
        localStorage.setItem(
          "selectedProducts",
          JSON.stringify(state.selectedProducts),
        );
      }
    },
    updateSelectedProducts: (state, action) => {
      const productIds = action.payload;
      state.selectedProducts = productIds;
      if (isClient) {
        localStorage.setItem(
          "selectedProducts",
          JSON.stringify(state.selectedProducts),
        );
      }
    },
    clearSelectedProducts: (state) => {
      state.selectedProducts = [];
      if (isClient) {
        localStorage.removeItem("selectedProducts");
      }
    },

    // addSelectedProduct: (state, action) => {
    //   const productId = action.payload;
    //   if (!state.selectedProducts.includes(productId)) {
    //     state.selectedProducts.push(productId); // Add product ID if not already included
    //   }
    // },
    // removeSelectedProduct: (state, action) => {
    //   const productId = action.payload;
    //   state.selectedProducts = state.selectedProducts.filter(
    //     (id) => id !== productId
    //   ); // Remove product ID from selectedProducts array
    // },
    // clearSelectedProducts: (state) => {
    //   state.selectedProducts = []; // Clear all selected products
    // },
    // updateSelectedProducts: (state, action) => {
    //   const productIds = action.payload;
    //   state.selectedProducts = productIds; // Replace the entire selectedProducts array
    // },
  },
});

export const {
  setAuthData,
  clearAuthData,
  addSelectedProduct,
  removeSelectedProduct,
  clearSelectedProducts,
  updateSelectedProducts,
} = authSlice.actions;

export const selectOrganizationId = (state: {
  auth: { organizationId: string };
}) => state.auth.organizationId;
export const selectToken = (state: { auth: { token: string } }) =>
  state.auth.token;
export const selectUser = (state: { auth: { user: User } }) => state.auth.user;
export const selectUserId = (state: { auth: { userId: string } }) =>
  state.auth.userId;
export const selectSelectedProducts = (state: {
  auth: { selectedProducts: React.Key[] };
}) => state.auth.selectedProducts; // Add selector for selectedProducts

export default authSlice.reducer;

// import { createSlice } from "@reduxjs/toolkit";
// import { User } from "@/types";

// // Check if window is defined (indicating we are in a client-side environment)
// const isClient = typeof window !== "undefined";

// // Function to parse the user data from a JSON string to a User object
// const parseUser = (userString: string | null): User | null => {
//   try {
//     return userString ? JSON.parse(userString) : null;
//   } catch (error) {
//     console.error("Error parsing user data:", error);
//     return null;
//   }
// };

// // Retrieve organizationId, token, and selectedProducts from localStorage, if available
// const initialState = {
//   organizationId: isClient ? localStorage.getItem("organizationId") || null : null,
//   token: isClient ? localStorage.getItem("token") || null : null,
//   user: isClient ? parseUser(localStorage.getItem("user")) || null : null,
//   userId: isClient ? localStorage.getItem("userId") || null : null,
//   selectedProducts: isClient ? JSON.parse(localStorage.getItem("selectedProducts") || "[]") : [], // Rehydrate selectedProducts
// };

// export const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setAuthData: (state, action) => {
//       const { organizationId, token, user, userId, selectedProducts } = action.payload;
//       state.organizationId = organizationId;
//       state.token = token;
//       state.user = user;
//       state.userId = userId;
//       state.selectedProducts = selectedProducts;

//       if (isClient) {
//         localStorage.setItem("organizationId", organizationId);
//         localStorage.setItem("token", token);
//         localStorage.setItem("user", JSON.stringify(user));
//         localStorage.setItem("userId", userId);
//         localStorage.setItem("selectedProducts", JSON.stringify(selectedProducts));
//       }
//     },
//     clearAuthData: (state) => {
//       state.organizationId = null;
//       state.token = null;
//       state.user = null;
//       state.userId = null;
//       state.selectedProducts = [];

//       if (isClient) {
//         localStorage.removeItem("organizationId");
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         localStorage.removeItem("userId");
//         localStorage.removeItem("selectedProducts");
//       }
//     },
//     addSelectedProduct: (state, action) => {
//       const productId = action.payload;
//       if (!state.selectedProducts.includes(productId)) {
//         state.selectedProducts.push(productId);
//       }
//       if (isClient) {
//         localStorage.setItem("selectedProducts", JSON.stringify(state.selectedProducts));
//       }
//     },
//     removeSelectedProduct: (state, action) => {
//       const productId = action.payload;
//       state.selectedProducts = state.selectedProducts.filter((id: any) => id !== productId);
//       if (isClient) {
//         localStorage.setItem("selectedProducts", JSON.stringify(state.selectedProducts));
//       }
//     },
//     updateSelectedProducts: (state, action) => {
//       state.selectedProducts = action.payload;
//       if (isClient) {
//         localStorage.setItem("selectedProducts", JSON.stringify(state.selectedProducts));
//       }
//     },
//   },
// });

// export const { setAuthData, clearAuthData, addSelectedProduct, removeSelectedProduct, updateSelectedProducts } = authSlice.actions;

// export const selectSelectedProducts = (state: { auth: { selectedProducts: React.Key[] } }) => state.auth.selectedProducts;
// export const selectOrganizationId = (state: {
//   auth: { organizationId: string };
// }) => state.auth.organizationId;
// export const selectToken = (state: { auth: { token: string } }) =>
//   state.auth.token;
// export const selectUser = (state: { auth: { user: User } }) => state.auth.user;
// export const selectUserId = (state: { auth: { userId: string } }) =>
//   state.auth.userId;
// // export const selectSelectedProducts = (state: { auth: { selectedProducts: React.Key[] } }) =>
// //   state.auth.selectedProducts;
// export default authSlice.reducer;
