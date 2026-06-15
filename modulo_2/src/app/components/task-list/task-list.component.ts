import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Task } from '../../store/task.model';
import { TaskState, selectTasks } from '../../store/task.reducer';
import * as TaskActions from '../../store/task.actions';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
  standalone: false
})
export class TaskListComponent {
  tasks$: Observable<Task[]>;

  constructor(private store: Store<{ taskState: TaskState }>) {
    this.tasks$ = this.store.select(selectTasks);
  }

  onTaskCreated(event: { name: string; category: string }): void {
    const newTask: Task = {
      id: Date.now().toString(),
      name: event.name,
      category: event.category,
      votes: 0
    };
    this.store.dispatch(TaskActions.addTask({ task: newTask }));
  }

  onUpvote(id: string): void {
    this.store.dispatch(TaskActions.upvoteTask({ id }));
  }

  onDownvote(id: string): void {
    this.store.dispatch(TaskActions.downvoteTask({ id }));
  }

  onDelete(id: string): void {
    this.store.dispatch(TaskActions.deleteTask({ id }));
  }
}
