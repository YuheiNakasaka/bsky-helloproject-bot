```
npx firebase emulators:start --only functions,firestore

cd functions
npm run build:watch
npx firebase functions:shell
```
