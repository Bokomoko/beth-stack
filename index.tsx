import { Elysia } from 'elysia';
import { html } from '@elysiajs/html';
// import { BaseHtml } from './BaseHtml';
import { TodoList } from './TodoList';

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
        <body class='flex w-full h-screen justify-center itens-center'>
          <button hx-post='/clicked' hx-swap='outerHTML'>
            Click Me
          </button>
        </body>
      </BaseHtml>
    )
  )
  .post('/clicked', () => (
    <div class='text-blue-600'>You've clicked indeed, haven't you?</div>
  ))
  //  .get('/todos', () => <TodoList todos={db} />)
  .listen(13000);
console.log(
  `Elysia is running on http://${app.server?.hostname}:${app.server?.port}`
);
