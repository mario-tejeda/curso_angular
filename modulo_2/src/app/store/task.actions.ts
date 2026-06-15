import { createAction, props } from '@ngrx/store';
import { Task } from './task.model';

export const addTask = createAction(
  '[Task List] Add Task',
  props<{ task: Task }>()
);

export const deleteTask = createAction(
  '[Task List] Delete Task',
  props<{ id: string }>()
);

export const upvoteTask = createAction(
  '[Task List] Upvote Task',
  props<{ id: string }>()
);

export const downvoteTask = createAction(
  '[Task List] Downvote Task',
  props<{ id: string }>()
);
