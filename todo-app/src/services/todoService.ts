import type { Todo } from '../types/todo';

// Supabase 연동 시 supabaseTodoService.ts를 만들고
// useTodos.ts에서 이 인터페이스를 구현한 서비스로 교체하면 됨
export interface TodoService {
  getAll(): Promise<Todo[]>;
  add(text: string): Promise<Todo>;
  toggle(id: string, completed: boolean): Promise<Todo>;
  toggleImportant(id: string, important: boolean): Promise<Todo>;
  update(id: string, text: string): Promise<Todo>;
  remove(id: string): Promise<void>;
  clearCompleted(): Promise<void>;
}
