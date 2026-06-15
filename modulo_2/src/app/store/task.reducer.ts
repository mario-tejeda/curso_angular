import { createReducer, on } from '@ngrx/store';
import { Task } from './task.model';
import * as TaskActions from './task.actions';

export interface TaskState {
  tasks: Task[];
}

export const initialState: TaskState = {
  tasks: [
    { id: '1', name: 'Aprender Angular Avanzado', category: 'Estudios', votes: 5 },
    { id: '2', name: 'Configurar Store de Redux (NgRx)', category: 'Desarrollo', votes: 8 },
    { id: '3', name: 'Crear estilos CSS premium', category: 'Diseño', votes: 3 }
  ]
};

export const taskReducer = createReducer(
  initialState,
  on(TaskActions.addTask, (state, { task }) => ({
    ...state,
    tasks: [...state.tasks, task]
  })),
  on(TaskActions.deleteTask, (state, { id }) => ({
    ...state,
    tasks: state.tasks.filter(t => t.id !== id)
  })),
  on(TaskActions.upvoteTask, (state, { id }) => ({
    ...state,
    tasks: state.tasks.map(t => t.id === id ? { ...t, votes: t.votes + 1 } : t)
  })),
  on(TaskActions.downvoteTask, (state, { id }) => ({
    ...state,
    tasks: state.tasks.map(t => t.id === id ? { ...t, votes: t.votes - 1 } : t)
  }))
);
export const selectTasks = (state: { taskState: TaskState }) => state.taskState.tasks;
