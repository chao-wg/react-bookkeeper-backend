### This app require a .env file to run. The .env file should contain the following variables

```DATABASE_URL=yourDatabaseUrl```
```JWT_SECRET=yourSecret```

#### For local development

set the DATABASE_URL to the following format
```DATABASE_URL=DBprovider://someUserName:somePwd@localhost:5432/mydb?schema=yourSchema```

#### For docker deployment

set the DATABASE_URL to the following format
```DATABASE_URL=DBprovider://following:somePwd@containerName:5432/mydb?schema=yourSchema```
