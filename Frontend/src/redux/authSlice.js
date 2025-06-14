import { createSlice } from "@reduxjs/toolkit";

// Function to load state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('authState');
    if (serializedState === null) {
      return undefined; // Let Redux use its initial state
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.error("Error loading state from localStorage:", error);
    return undefined;
  }
};

// Function to save state to localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('authState', serializedState);
  } catch (error) {
    console.error("Error saving state to localStorage:", error);
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: loadState() || {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    loginSuccess: (state, { payload }) => {
      state.user = payload.user;
      state.token = payload.token;
      state.loading = false;
      state.error = null;
      saveState({ user: payload.user, token: payload.token }); // Save state on login success
    },
    loginFailure: (state, { payload }) => {
      state.error = payload;
      state.loading = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('authState'); // Clear state on login failure
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('authState'); // Clear state on logout
    },
    setLoading: (state, { payload }) => {
      state.loading = payload;
    },
  },
});

export const { loginSuccess, loginFailure, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;


