# Backend Step 2: Splitting One File Into Small Files

## Why We Are Doing This

At first, keeping everything inside `server.js` was good because it was easy to start.

But if we keep adding more and more code into one file, it will become hard to read.

So now we are doing a very normal developer step:

- one file for starting the server
- one file for building the app
- one file for sample state data
- small files for routes

Think of it like this:

- `server.js` = the switch that turns the server on
- `app.js` = the main classroom
- `routes` = different doors in the classroom
- `data` = the notebook where sample data is kept

## New Backend File Structure

```text
backend/
  src/
    app.js
    server.js
    data/
      states.js
    routes/
      homeRoutes.js
      healthRoutes.js
      stateRoutes.js
```

## What Each File Does

### `server.js`

This file only starts the server.

Its job is:

- get the app from `app.js`
- choose the port number
- start listening

This is nice because now `server.js` stays very small.

### `app.js`

This file builds the Express app.

Its job is:

- create the app
- turn on JSON reading
- connect route files to the app

This file is like the center manager.

### `data/states.js`

This file stores sample state data.

Right now, this is fake practice data.

Later, real data will come from the database.

For now, this file helps us learn routing without needing PostgreSQL yet.

### `routes/homeRoutes.js`

This file handles the home route:

`/`

When someone opens the main URL, this route sends a simple JSON message.

### `routes/healthRoutes.js`

This file handles:

`/api/v1/health`

This route is used to quickly check:

"Is the server alive and working?"

### `routes/stateRoutes.js`

This file handles:

`/api/v1/states`

This route reads sample state data and sends it back as JSON.

## Very Important Beginner Concept: `require()`

You will see lines like this:

```js
const app = require("./app");
```

This means:

"Please bring code from another file into this file."

So `require()` is like calling a helper from another room.

## Very Important Beginner Concept: `module.exports`

You will also see lines like this:

```js
module.exports = app;
```

This means:

"I want to share this thing with other files."

So:

- `module.exports` sends something out
- `require()` brings something in

These two work together.

## Route Mounting In Simple Words

In `app.js`, we wrote:

```js
app.use("/api/v1", healthRoutes);
app.use("/api/v1", stateRoutes);
```

This means:

- all routes inside `healthRoutes` will start with `/api/v1`
- all routes inside `stateRoutes` will also start with `/api/v1`

So if `healthRoutes.js` has:

```js
router.get("/health", ...)
```

the final full route becomes:

```text
/api/v1/health
```

That is called combining the base path with the route path.

## Why This Is Better Than One Big File

- easier to read
- easier to find bugs
- easier to add new routes later
- easier for teams to work together
- easier for you to learn step by step

## What We Will Probably Do Next

The next beginner-friendly backend step can be:

1. add district and sub-district sample routes
2. create a route for villages
3. connect the backend to real dataset processing later
4. start designing database tables in code using Prisma

For now, this step is enough: we learned how to organize a backend in a cleaner way without making it too advanced.
