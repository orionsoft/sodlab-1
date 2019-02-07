## About

The frontend of main Sodlab API. It is built with React.


## Installation

To use the app you will have to
1. Install Nodejs
2. Install Yarn
3. Install the dependencies

```console
yarn
```


## Run the app in development

To run the app in a development environment.
1. Execute the following the command
```console
yarn start
```
This apps depends completely on the API to even start. So it will only work if the API is already running.

## Create a user to start using the app

1. Open the code in your code editor of choice
2. Navigate to /web/src/App/Pages/Auth/index.js
3. Uncomment line 88, so that the route /register can be navigated to
4. In the top of the file, add after all the import
```js
import Register from './Register'
```
5. After running the app, in your browser go to /register and register yourself
6. After creating your user, use your mongo client of choice, go to "users" collection and look for the user you created, you should edit the roles property so that it includes both the superAdmin and admin strings in the array.
```js
roles=['superAdmin','admin']
```
7. Now logging to the app and you should land in the Super Admin page, looking at the "Usuarios", "Ambientes" and "Cobranza" tiles.

**!!!IMPORTANT: Undo the changes you made in steps 3 and 4. This part should not go into production.**

## Deployment

This SPA is hosted in AWS using S3 to host the static files. There are is bucket for every environment and api, each named sodlab-web-beta and sodlab-web-prod.
The scripts for building and deploying the app are inside the package.json file.

1. Build a production ready app.

```console
yarn build
````
2. Deploy to the desired bucket
```console
yarn deploy-{environment}
````

**!!IMPORTANT: Before running the deployment scripts, be sure to have added the named profile "sodlab-developer" to the profiles file. For more information, check out https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html**

