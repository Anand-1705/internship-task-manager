import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://69760224c0c36a2a994ffdb4.mockapi.io/tasks";

// 🔹 GET all tasks
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async () => {
    const response = await axios.get(API_URL);
    return response.data;
  }
);

// 🔹 ADD task
export const addTask = createAsyncThunk(
  "tasks/addTask",
  async (task) => {
    const response = await axios.post(API_URL, task);
    return response.data;
  }
);

// 🔹 DELETE task
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    return id;
  }
);

// 🔹 UPDATE task (toggle status)
export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, updatedData }) => {
    const response = await axios.put(`${API_URL}/${id}`, updatedData);
    return response.data;
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchTasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // addTask
      .addCase(addTask.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      // deleteTask
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.list = state.list.filter((t) => t.id !== action.payload);
      })
      // updateTask
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.list.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      });
  },
});

export default taskSlice.reducer;
