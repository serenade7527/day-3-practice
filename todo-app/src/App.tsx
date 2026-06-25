import { useTodos } from './hooks/useTodos';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';

function App() {
  const {
    todos,
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
  } = useTodos();

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center pt-16 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">
          Todo
        </h1>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <TodoInput onAdd={addTodo} />

          {loading ? (
            <p className="text-center text-gray-400 text-sm py-8">불러오는 중...</p>
          ) : (
            <TodoList
              todos={todos}
              onToggle={toggleTodo}
              onToggleImportant={toggleImportant}
              onUpdate={updateTodo}
              onRemove={removeTodo}
            />
          )}

          <TodoFilter
            filter={filter}
            activeCount={activeCount}
            completedCount={completedCount}
            onFilterChange={setFilter}
            onClearCompleted={clearCompleted}
          />
        </div>

        <p className="text-center text-gray-400 text-xs mt-4">
          더블클릭으로 수정 · Enter로 저장 · Esc로 취소
        </p>
      </div>
    </div>
  );
}

export default App;
