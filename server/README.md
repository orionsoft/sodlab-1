## About

The main API of the Sodlab App. It is built with NodeJS using the OrionJs framework [OrionJs](https://github.com/orionjs/orionjs)
and uses GraphQL and REST as commucation methods. It uses MongoDB for the database.


## Installation

To use the API you need to have installed
1. Nodejs
2. MongoDB

After that, to use the framework you can follow the official instructions in https://orionjs.com/docs/installation.html.
In short.
1. Install the Orionjs CLI

```console
yarn global add @orion-js/cli
```

2. Install de dependencies

```console
yarn
```


## Run the app in development

To run the app in a development environment.
1. Execute the following the command
`orion start --shell`
This is not the recommended method but it helps to prove that the installation was successful.
2. Use a shell script.
* Create the script
Crate a shell script in the root folder. In this case it will be called start.sh. Inside of it you will put the environment variables the app uses, e.g:
```sh
export AWS_S3_ACCESS_KEY_ID="YOUR_AWS_ACCOUNT_ACCESS_KEY_ID"
export AWS_S3_SECRET_ACCESS_KEY="YOUR_AWS_ACCOUNT_SECRET_ACCESS_KEY"
export AWS_S3_BUCKETNAME="sodlabx-filemanager-dev"
export AWS_S3_REGION="us-east-1"
export SERVER_URL="https://api.beta.sodlab.com"
export MAIL_FROM="\"Sodlab\" <app@sodlab.com>"
export MAIL_URL="smtps://AKIAIPWNFNVV6INCISPA:AqtcdUsNyUJN1EmfHiKqJWACcbTL4Rqw4TjSQfRIGQfr@email-smtp.us-east-1.amazonaws.com"
export HSM_DOC_FINDER_TOKEN="123"
export NODE_ENV="development"

orion start --shell
```
* Give permissions to the script

```console
sudo chmod 777 start.sh
```
* Execute the script to run the app
This will include all the environment variables when starting the app
```console
./start.sh
```

### Known issues when using the Orionjs CLI and Orionjs framework:
* Sometimes the package may not be globally available inmediatly and a restart or shut down may be necessary
* Sometimes it will ask you donwload additional packages, in wich case take note of the missing package and install it globally
* When starting the project it will ask for aditional permisions, in wich case you can use sudo to execute the commands

## Deployment

The app is hosted on AWS using the Elastic Beanstalk service. It is recommended to read the documentation before doing anything. The next steps assume you have installed the eb CLI and have initialized the project in the current folder.

1. Build a production ready app.

There is a script built already that compiles the app, just give it execution permissions and execute it.
```console
./sodlab-build.sh
````
2. Get the last version of the environment deployed to EBS
```console
eb status sodlab-server-{environment}
````
This will return a set a of properties that will include the last deployed version in that environemnt, use that info to correctly increase the next deployment version

2. Deploy to the beta environment in the sodlab-server app
```console
eb deploy sodlab-server-beta -l vx.y.z-beta -m 'PR #XXX. Some short description'
```

3. Deploy to the production environment in the sodlab-server app
```console
eb deploy sodlab-server-prod -l vx.y.z -m 'PR #XXX. Some short description'
```

