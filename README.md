# Spark Space Grid

A React application for creating persitent layouts of resizable/draggable Spark spaces in grid.

### `npm install`

Install dependecies

### `npm start`

Runs the app in development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will see the build errors and lint warnings in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

### Configuration

Update `CLIENT_ID` in `/src/constants.js` to specify the Client ID of the Oauth client to authorize users with.<br>
You can create a new integration and obtain a Client ID at [https://developer.ciscospark.com](https://developer.ciscospark.com).<br>
Be sure to only select the `spark:all` scope when creating your integration.

