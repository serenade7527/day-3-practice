import type { Todo } from '../types/todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  onToggle: (id: string, completed: boolean) => void;
  onToggleImportant: (id: string, important: boolean) => void;
  onUpdate: (id: string, text: string) => void;
  onRemove: (id: string) => void;
}

export function TodoList({ todos, onToggle, onToggleImportant, onUpdate, onRemove }: Props) {
  if (todos.length === 0) {
    return (
      <p className="text-center text-gray-400 text-sm py-8">
        할 일이 없습니다.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-gray-100">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onToggleImportant={onToggleImportant}
          onUpdate={onUpdate}
          onRemove={onRemove}
        />
      ))}
    </ul>
  );
}
