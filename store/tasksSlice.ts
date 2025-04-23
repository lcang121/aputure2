import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: [] as Task[],
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => action.payload,
    addTask: (state, action: PayloadAction<Task>) => {
      state.push(action.payload);
      persistTasks(state);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.findIndex(task => task.id === action.payload.id);
      state[index] = action.payload;
      persistTasks(state);
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      const filtered = state.filter(task => task.id !== action.payload);
      persistTasks(filtered);
      return filtered;
    },
  },
});

export const { setTasks, addTask, updateTask, deleteTask } = tasksSlice.actions;
export default tasksSlice.reducer;

const persistTasks = async (tasks: Task[]) => {
  try {
    await AsyncStorage.setItem('TASKS', JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks', e);
  }
};