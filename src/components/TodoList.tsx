import { TodoItem } from './TodoItem';

export function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <div>
      {todos.map(todo => (
        <TodoItem {...todo} />
      ))}
    </div>
  );
}
