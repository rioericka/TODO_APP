import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { TodoService } from '../todo.service';
import { Todo } from '../todo.model';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
  ],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
})
export class TodoComponent implements OnInit {
  todos: Todo[] = [];
  newTodoTitle = '';
  editingTodo: Todo = {} as Todo;
  
  @ViewChild('editDialog') editDialog!: TemplateRef<any>;

  constructor(
    private todoService: TodoService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.todoService.getTodos().subscribe((data) => {
      this.todos = data.slice(0, 10);
    });
  }

  addTodo() {
    if (!this.newTodoTitle.trim()) return;

    const todo: Partial<Todo> = {
      userId: 1,
      title: this.newTodoTitle,
      completed: false,
    };

    this.todoService.addTodo(todo).subscribe((created) => {
      this.todos.unshift(created);
      this.newTodoTitle = '';
    });
  }

  toggleComplete(todo: Todo) {
    todo.completed = !todo.completed;
    this.updateTodo(todo);
  }

  updateTodo(todo: Todo) {
    this.todoService.updateTodo(todo.id, todo).subscribe();
  }

  deleteTodo(id: number) {
    this.todoService.deleteTodo(id).subscribe(() => {
      this.todos = this.todos.filter((t) => t.id !== id);
    });
  }

  editTodo(todo: Todo) {
    this.editingTodo = { ...todo };
    this.dialog.open(this.editDialog);
  }

  saveEdit() {
    if (!this.editingTodo.title.trim()) return;
    
    const index = this.todos.findIndex(t => t.id === this.editingTodo.id);
    if (index !== -1) {
      this.todos[index] = { ...this.editingTodo };
      this.updateTodo(this.editingTodo);
    }
  }
}