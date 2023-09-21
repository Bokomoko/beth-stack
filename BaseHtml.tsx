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
