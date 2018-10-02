# API

## Install & Run
```bash
git clone https://gitlab.com/poulet_t_Etna_Projects/Etna1/pli-api.git
cd pli-api/
# After having followed the requirements part
docker-compose up --build
```

>- [API URL](localhost:8080)
>- [API Doc URL](localhost:80)

## Requirements

#### Environment variables

You need to create a ```.env``` file in the project folder with the following structure :
```env
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_DATABASE_URL=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
```

You can find the required values [Here](https://console.firebase.google.com/project/etna-pli-c4463/settings/general/)

#### Firebase admin credentials

1. You need to go [Here](https://console.firebase.google.com/project/etna-pli-c4463/settings/serviceaccounts/adminsdk)
2. Click on the button to generate new private key, it will download a file
3. Rename the file ```firebase_credentials.json```
4. Move the file to the project folder.

## Documentations

- [Firebase-admin](https://firebase.google.com/docs/admin/setup)
- [Firebase](https://firebase.google.com/docs/web/setup)
- [Swagger-ui](https://github.com/swagger-api/swagger-ui)
- [Swagger editor](https://editor.swagger.io/)
- [TypeScript](https://www.typescriptlang.org/index.html)
- [ts-node](https://github.com/TypeStrong/ts-node)
- [ACL](https://www.npmjs.com/package/acl) / [ACL-firebase](https://www.npmjs.com/package/acl-firebase)
