import { Elysia } from 'elysia';
import { html } from '@elysiajs/html';
import * as elements from 'typed-html';

export const BaseHtml = ({ children }: elements.Children) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Another Pink Floyd Album</title>
  <!-- The following script will allow for htmx to work in this page -->
  <script src="https://unpkg.com/htmx.org@1.9.3"></script>
  <!-- Do you want Tailwind? All you have to do is add the following script -->
  <script src="https://cdn.tailwindcss.com"></script>
</head>
${children}
</html>
`; // This is a very basic HTML template, but you can use any template engine you want.

export function TodoItem({ content, completed, id }: Todo) {
  return (
    <div class='flex flex-row space-x-3'>
      <p>{content}</p>
      <input type='checkbox' checked={completed} />
      <button class='text-red-600'>X</button>
    </div>
  );
}

export function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <div>
      {todos.map(todo => (
        <TodoItem {...todo} />
      ))}
    </div>
  );
}

const db: Todo[] = [
  {
    id: 1,
    content: 'Buy milk',
    completed: false,
  },
  {
    id: 2,
    content: 'Buy eggs',
    completed: false,
  },
  {
    id: 3,
    content: 'Buy bread',
    completed: false,
  },
];

const app = new Elysia()
  .use(html())
  .get('/', ({ html }) =>
    html(
      <BaseHtml>
        <body
          class='flex w-full h-screen justify-center itens-center'
          hx-get='/todos'
          hx-trigger='load'
          hx-swap='innerHTML'
        ></body>
      </BaseHtml>
    )
  )
  .post('/clicked', () => (
    <div class='text-blue-600'>You've clicked indeed, haven't you?</div>
  ))
  .get('/todos', () => <TodoList todos={db} />)
  .listen(13000);
console.log(
  `Elysia is running on http://${app.server?.hostname}:${app.server?.port}`
);
