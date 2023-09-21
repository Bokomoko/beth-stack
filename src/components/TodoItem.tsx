export function TodoItem({ content, completed, id }: Todo) {
  return (
    <div class='flex flex-row space-x-3'>
      <p>{content}</p>
      <input type='checkbox' checked={completed} />
      <button class='text-red-600'>X</button>
    </div>
  );
}
