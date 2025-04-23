import AsyncStorage from '@react-native-async-storage/async-storage';
import {Task} from '../types/taskTypes';

export const saveTasks = async (tasks: Task[]) => {
  await AsyncStorage.setItem('TASKS', JSON.stringify(tasks));
};

export const loadTasks = async (): Promise<Task[]> => {
  const json = await AsyncStorage.getItem('TASKS');
  return json ? JSON.parse(json) : [];
};
