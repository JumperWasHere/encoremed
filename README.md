## Common setup

Clone the repo and install the dependencies.

```bash
git clone git@github.com:JumperWasHere/encoremed.git
cd ecomend
```

```bash
npm install
```

## Steps for read-only access

To start the express server, run the following

```bash
npm run start
```
To start the express server with auto balancing with cluster , run the following

```bash
npm run cluster
```

by default port 3000, unless have you have state another PORT at .ENV file 
Open [http://localhost:3000](http://localhost:3000) and take a look around.



 Open `.env` and inject your credentials so it looks like this

```
TOKEN_SECRET=<JWT_TOKEN_SECRET>
PORT=<PORT>
CON_SERVER=SERVER_NAME
CON_DATABASE=DATABASE_NAME
CON_USER=DATABASE_USERNAME
CON_PASSWORD=DATABASE_USER_PASSWORD
```

## Database using SQL SERVER 2019