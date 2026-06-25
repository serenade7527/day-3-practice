import { useState, type KeyboardEvent } from 'react';
import type { Todo } from '../types/todo';

interface Props {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onToggleImportant: (id: string, important: boolean) => void;
  onUpdate: (id: string, text: string) => void;
  onRemove: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onToggleImportant, onUpdate, onRemove }: Props) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  function commitEdit() {
    if (editText.trim()) {
      onUpdate(todo.id, editText);
    } else {
      setEditText(todo.text);
    }
    setEditing(false);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') {
      setEditText(todo.text);
      setEditing(false);
    }
  }

  return (
    <li className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-0 group">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={(e) => onToggle(todo.id, e.target.checked)}
        className="w-4 h-4 accent-blue-500 cursor-pointer flex-shrink-0"
      />

      {editing ? (
        <input
          autoFocus
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={handleKeyDown}
          className="flex-1 px-2 py-0.5 border border-blue-400 rounded focus:outline-none text-sm"
        />
      ) : (
        <span
          onDoubleClick={() => setEditing(true)}
          className={`flex-1 text-sm cursor-text select-none ${
            todo.completed ? 'line-through text-gray-400' : 'text-gray-700'
          }`}
        >
          {todo.text}
        </span>
      )}

      <button
        onClick={() => onToggleImportant(todo.id, !todo.important)}
        className={`text-xl leading-none transition-colors ${
          todo.important ? 'text-yellow-400' : 'opacity-0 group-hover:opacity-100 text-gray-300 hover:text-yellow-400'
        }`}
        aria-label="중요 표시"
      >
        ★
      </button>

      <button
        onClick={() => onRemove(todo.id)}
        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all text-lg leading-none"
        aria-label="삭제"
      >
        ×
      </button>
    </li>
  );
}
