import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forbiddenWordsValidator } from '../../validators/custom-validators';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
  standalone: false
})
export class TaskFormComponent {
  @Output() taskCreated = new EventEmitter<{ name: string; category: string }>();

  taskForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      name: ['', [
        Validators.required,
        forbiddenWordsValidator(['spam', 'xyz', 'basura'])
      ]],
      category: ['', [
        Validators.required
      ]]
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.taskCreated.emit({
        name: this.taskForm.value.name.trim(),
        category: this.taskForm.value.category.trim()
      });
      this.taskForm.reset();
    } else {
      this.taskForm.markAllAsTouched();
    }
  }
}
