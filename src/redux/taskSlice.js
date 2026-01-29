import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";
import { retryRequest } from "../utils/retry";

// 🔹 GET all tasks
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async () => {
    const response = await retryRequest(() =>
      api.get("/tasks")
    );
    return response.data;
  }
);

// 🔹 ADD task
export const addTask = createAsyncThunk(
  "tasks/addTask",
  async (task) => {
    const response = await api.post("/tasks", task);
    return response.data;
  }
);

// 🔹 DELETE task
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id) => {
    await api.delete(`/tasks/${id}`);
    return id;
  }
);

// 🔹 UPDATE task
export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, updatedData }) => {
    const response = await api.put(`/tasks/${id}`, updatedData);
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
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (t) => t.id !== action.payload
        );
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (t) => t.id === action.payload.id
        );
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      });
  },
});

export default taskSlice.reducer;
