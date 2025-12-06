running the Fragments Server

Quick guide for running, developing, and debugging the server for my Fragments project.

Environment Variables

Dev stuff lives in debug.env.

Example:

LOG_LEVEL=debug

Tip: Only use LOG_LEVEL=debug while developing. Prints all env variables, so don’t use in production.

Scripts I Use
Script What it does
npm run lint Checks code with ESLint (src/\*_/_.js) for any errors.
npm start Runs the server normally on port 8080.
npm run dev Same as start but watches files. Reloads when I change stuff.
npm run debug Watch mode + Node debugger on 9229. Great with VSCode for breakpoints.
How I Test the Server

Start the server normally:

npm start

Open browser and go to:

http://localhost:8080

Expected JSON response:

{
"status": "ok",
"author": "Rohith Haridas",
"githubUrl": "https://github.com/rharidas2/fragments",
"version": "0.0.1"
}

Terminal check with curl + jq (pretty-print JSON):

curl -s localhost:8080 | jq

Dev mode with auto-reload:

npm run dev

Debug mode for breakpoints:

npm run debug

Then open VSCode, set breakpoints in src/app.js, and hit them when loading the route.

Extra Notes

Make sure dependencies are installed:

npm install

Stop server anytime with CTRL + C.

When debugging, you can see all environment variables with process.env. Don’t log secrets in production.

I usually test in the browser first, then curl, to make sure the health route is working.
Trigger GitHub Actions workflow
