import { createSlice } from "@reduxjs/toolkit";
//import React from "react";

const dataSlice = createSlice({
  name: "data",

  initialState: {
    loading:false,
    contentCategories:[],
    contents:[],
    branches:[],
    complaints:[],
    doctors:[],
    patients:[],
    admins:[],
    appointments:[],
    cities:[],
    messages:[],
    events:[],
    weekdays: [],
    files:[],
    tasks:[],
    notes:[],
    notifications:[], 
  },
  reducers:{
    addMessage: (state, { payload }) => {
      state.messages.push(payload);
    },
    fetchStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getDataSuccess: (state, {payload}) => {
      state.loading = false;
      // Handle appointments data structure
      if (payload.url === "appointments") {
        state[payload.url] = Array.isArray(payload.data?.data) ? payload.data.data : [];
      } else {
        state[payload.url] = payload.data;
      }
    },

    fetchFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    putSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
  }

});
export const {
  fetchStart,
  getDataSuccess,
  addMessage,
  fetchFail,
  putSuccess,
} = dataSlice.actions

export default dataSlice.reducer;
