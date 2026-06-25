import type { Todo } from '../types/todo';
import type { TodoService } from './todoService';

// Supabase 연동 시 이 파일 대신 supabaseTodoService.ts를 만들어 교체
// 환경변수 예시 (Supabase 연동 시 .env에 추가):
//   VITE_SUPABASE_URL=https://xxxx.supabase.co
//   VITE_SUPABASE_ANON_KEY=your-anon-key

const STORAGE_KEY = 'todos';

function load(): Todo[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function save(todos: Todo[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

export const localTodoService: TodoService = {
  async getAll() {
    return load();
  },

  async add(text) {
    const todos = load();
    const todo: Todo = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      important: false,
      created_at: new Date().toISOString(),
    };
    save([...todos, todo]);
    return todo;
  },

  async toggle(id, completed) {
    const todos = load();
    const updated = todos.map((t) =>
      t.id === id ? { ...t, completed } : t
    );
    save(updated);
    return updated.find((t) => t.id === id)!;
  },

  async toggleImportant(id, important) {
    const todos = load();
    const updated = todos.map((t) =>
      t.id === id ? { ...t, important } : t
    );
    save(updated);
    return updated.find((t) => t.id === id)!;
  },

  async update(id, text) {
    const todos = load();
    const updated = todos.map((t) =>
      t.id === id ? { ...t, text: text.trim() } : t
    );
    save(updated);
    return updated.find((t) => t.id === id)!;
  },

  async remove(id) {
    save(load().filter((t) => t.id !== id));
  },

  async clearCompleted() {
    save(load().filter((t) => !t.completed));
  },
};
