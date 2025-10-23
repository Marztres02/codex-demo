import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  readonly storageKey = 'codex-web-todos';
  todos: TodoItem[] = [];
  newTaskTitle = '';

  constructor() {
    this.todos = this.loadTasks();
  }

  get pendingCount(): number {
    return this.todos.filter((todo) => !todo.completed).length;
  }

  addTask(): void {
    const title = this.newTaskTitle.trim();
    if (!title) {
      return;
    }

    const newTodo: TodoItem = {
      id: Date.now(),
      title,
      completed: false
    };

    this.todos = [...this.todos, newTodo];
    this.newTaskTitle = '';
    this.saveTasks();
  }

  toggleCompletion(todo: TodoItem): void {
    this.todos = this.todos.map((item) =>
      item.id === todo.id ? { ...item, completed: !item.completed } : item
    );
    this.saveTasks();
  }

  removeTask(todoId: number): void {
    this.todos = this.todos.filter((todo) => todo.id !== todoId);
    this.saveTasks();
  }

  trackByTodoId(_: number, todo: TodoItem): number {
    return todo.id;
  }

  private loadTasks(): TodoItem[] {
    const storage = this.getStorage();
    if (!storage) {
      return [];
    }

    try {
      const storedValue = storage.getItem(this.storageKey);
      if (!storedValue) {
        return [];
      }

      const parsedValue: unknown = JSON.parse(storedValue);
      if (!Array.isArray(parsedValue)) {
        return [];
      }

      return parsedValue
        .map((item) => this.normalizeTodo(item))
        .filter((item): item is TodoItem => !!item && item.title.trim().length > 0);
    } catch {
      return [];
    }
  }

  private saveTasks(): void {
    const storage = this.getStorage();
    if (!storage) {
      return;
    }

    storage.setItem(this.storageKey, JSON.stringify(this.todos));
  }

  private normalizeTodo(candidate: unknown): TodoItem | null {
    if (
      typeof candidate !== 'object' ||
      candidate === null ||
      !('title' in candidate)
    ) {
      return null;
    }

    const title = String((candidate as { title: unknown }).title ?? '').trim();
    if (!title) {
      return null;
    }

    const idValue = (candidate as { id?: unknown }).id;
    const completedValue = (candidate as { completed?: unknown }).completed;

    const id = typeof idValue === 'number' ? idValue : Date.now();
    const completed = typeof completedValue === 'boolean' ? completedValue : false;

    return { id, title, completed };
  }

  private getStorage(): Storage | null {
    try {
      return typeof window !== 'undefined' ? window.localStorage : null;
    } catch {
      return null;
    }
  }
}
