import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import { db } from "./db";
import { Todo, todos } from "./db/schema";
import * as elements from "typed-html";
import { eq } from "drizzle-orm";
const app = new Elysia()
  .use(html())
  .get("/", ({ html }) =>
    html(
      <BaseHtml>
        <body
          class="flex w-full h-screen justify-center itens-center"
          hx-get="/todos"
          hx-trigger="load"
          hx-swap="innerHTML"
        ></body>
      </BaseHtml>
    )
  )
  .get("/todos", async () => {
    const data = await db.select().from(todos).all();
    return <TodoList todos={data} />;
  })
  .post(
    "/todos/toggle/:id",
    async ({ params }) => {
      const oldTodo = await db
        .select()
        .from(todos)
        .where(eq(todos.id, params.id))
        .get();
      const updatedTodo = await db
        .update(todos)
        .set({ completed: !oldTodo?.completed })
        .where(eq(todos.id, params.id))
        .returning()
        .get();
      return <TodoItem {...updatedTodo} />;
    },
    // for validation, you can use the following:
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  )
  .delete(
    "/todos/:id",
    async ({ params }) => {
      await db.delete(todos).where(eq(todos.id, params.id)).run();
    },
    { params: t.Object({ id: t.Numeric() }) }
  )
  .post(
    "/todos",
    async ({ body }) => {
      const newTodo = await db.insert(todos).values(body).returning().get();

      return <TodoItem {...newTodo} />;
    },
    { body: t.Object({ content: t.String({ minLength: 1 }) }) }
  )
  .get("/styles.css", () => Bun.file("./tailwind-gen/styles.css"))
  .listen(13000);
console.log(
  `Elysia is running on http://${app.server?.hostname}:${app.server?.port}`
);

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
    <div class="flex flex-row space-x-3">
      <p>{content}</p>
      <input
        type="checkbox"
        checked={completed}
        hx-post={`/todos/toggle/${id}`}
        hx-target="closest div"
        hx-swap="outerHTML"
      />
      <button
        class="text-red-600"
        hx-delete={`/todos/${id}`}
        hx-swap="outerHTML"
        hx-target="closest div"
      >
        X
      </button>
    </div>
  );
}

export function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <div>
      {todos.map((todo) => (
        <TodoItem {...todo} />
      ))}
      <TodoForm />
    </div>
  );
}

export function TodoForm() {
  return (
    <form
      class="flex flex-row space-x-3"
      hx-post="/todos"
      hx-swap="beforebegin"
    >
      <input type="text" name="content" class="border border-black" />
      <button type="submit">Add</button>
    </form>
  );
}
