import { Elysia, t } from 'elysia';
import { html } from '@elysiajs/html';
import { db } from './db';
import { Todo, todos } from './db/schema';
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
      <input
        type='checkbox'
        checked={completed}
        hx-post={`/todos/toggle/${id}`}
        hx-target='closest div'
        hx-swap='outerHTML'
      />
      <button
        class='text-red-600'
        hx-delete={`/todos/${id}`}
        hx-swap='outerHTML'
        hx-target='closest div'
      >
        X
      </button>
    </div>
  );
}

export function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <div>
      {todos.map(todo => (
        <TodoItem {...todo} />
      ))}
      <TodoForm />
    </div>
  );
}

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
  .delete(
    '/todos/:id',
    ({ params }) => {
      const todo = db.find(todo => todo.id === params.id);
      if (todo) {
        db.splice(db.indexOf(todo), 1);
      }
    },
    { params: t.Object({ id: t.Numeric() }) }
  )
  .post(
    '/todos',
    ({ body }) => {
      if (body.content.lenght === 0) {
        throw new Error('Content cannot be empty');
      }
      const todo: Todo = {
        id: db.length + 1,
        content: body.content,
        completed: false,
      };
      db.push(todo);
      return <TodoItem {...todo} />;
    },
    { body: t.Object({ content: t.String() }) }
  )

  .post(
    '/todos/toggle/:id',
    ({ params }) => {
      const todo = db.find(todo => todo.id === params.id);
      if (todo) {
        todo.completed = !todo.completed;
        return <TodoItem {...todo} />;
      }
    },
    // for validation, you can use the following:
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  )

  .listen(13000);
console.log(
  `Elysia is running on http://${app.server?.hostname}:${app.server?.port}`
);

export function TodoForm() {
  return (
    <form
      class='flex flex-row space-x-3'
      hx-post='/todos'
      hx-swap='beforebegin'
    >
      <input type='text' name='content' class='border border-black' />
      <button type='submit'>Add</button>
    </form>
  );
}
