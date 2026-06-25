export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  important: boolean;
  created_at: string;
}

export type FilterType = 'all' | 'active' | 'completed';
