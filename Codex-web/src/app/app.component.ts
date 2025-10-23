import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

const STORAGE_KEY = 'codex-web.todos';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  readonly title = 'Lista de tareas';
  todos: TodoItem[] = [];
  newTodo = '';

  ngOnInit(): void {
    this.todos = this.loadTodos();
  }

  get remainingTodos(): number {
    return this.todos.filter((todo) => !todo.completed).length;
  }

  get hasCompletedTodos(): boolean {
    return this.todos.some((todo) => todo.completed);
  }

  addTodo(): void {
    const value = this.newTodo.trim();

    if (!value) {
      return;
    }

    const todo: TodoItem = {
      id: this.createId(),
      text: value,
      completed: false,
    };

    this.todos = [...this.todos, todo];
    this.newTodo = '';
    this.persistTodos();
  }

  toggleTodo(id: string): void {
    this.todos = this.todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    this.persistTodos();
  }

  removeTodo(id: string): void {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this.persistTodos();
  }

  clearCompleted(): void {
    this.todos = this.todos.filter((todo) => !todo.completed);
    this.persistTodos();
  }

  trackById(_index: number, todo: TodoItem): string {
    return todo.id;
  }

  private loadTodos(): TodoItem[] {
    const storage = this.getStorage();

    if (!storage) {
      return [];
    }

    const raw = storage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw) as unknown;

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed
        .filter((value): value is TodoItem => this.isStoredTodo(value))
        .map((todo) => ({ ...todo }));
    } catch {
      return [];
    }
  }

  private persistTodos(): void {
    const storage = this.getStorage();

    if (!storage) {
      return;
    }

    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(this.todos));
    } catch {
      // Ignore persistence errors (for example, storage being full or unavailable).
    }
  }

  private createId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }

    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }

  private getStorage(): Storage | null {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return null;
      }

      return window.localStorage;
    } catch {
      return null;
    }
  }

  private isStoredTodo(value: unknown): value is TodoItem {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const record = value as Record<string, unknown>;

    return (
      typeof record['id'] === 'string' &&
      typeof record['text'] === 'string' &&
      typeof record['completed'] === 'boolean'
    );
  }
}
