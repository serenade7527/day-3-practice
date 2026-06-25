import { useCallback, useEffect, useState } from 'react';
import { localTodoService } from '../services/localTodoService';
import type { FilterType, Todo } from '../types/todo';

// Supabase 연동 시 localTodoService를 supabaseTodoService로 교체
const service = localTodoService;

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    service.getAll().then((data) => {
      setTodos(data);
      setLoading(false);
    });
  }, []);

  const addTodo = useCallback(async (text: string) => {
    if (!text.trim()) return;
    const todo = await service.add(text);
    setTodos((prev) => [...prev, todo]);
  }, []);

  const toggleTodo = useCallback(async (id: string, completed: boolean) => {
    const updated = await service.toggle(id, completed);
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }, []);

  const toggleImportant = useCallback(async (id: string, important: boolean) => {
    const updated = await service.toggleImportant(id, important);
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }, []);

  const updateTodo = useCallback(async (id: string, text: string) => {
    if (!text.trim()) return;
    const updated = await service.update(id, text);
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }, []);

  const removeTodo = useCallback(async (id: string) => {
    await service.remove(id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearCompleted = useCallback(async () => {
    await service.clearCompleted();
    setTodos((prev) => prev.filter((t) => !t.completed));
  }, []);

  const filteredTodos = todos.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  return {
    todos: filteredTodos,
    filter,
    loading,
    activeCount,
    completedCount,
    setFilter,
    addTodo,
    toggleTodo,
    toggleImportant,
    updateTodo,
    removeTodo,
    clearCompleted,
  };
}
