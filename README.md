# bsky-helloproject-bot

This is a Hello Project news bot for Bluesky.

Preparation for development is below.

```bash
# Install firebase-tools
$ npm install -g firebase-tools

# Login to firebase
$ npx firebase login

# Install dependencies
$ npm install

# Start emulators
$ npx firebase emulators:start --only functions,firestore

# Start local shell for executing jobs
$ cd functions
$ npm run build:watch
$ npx firebase functions:shell
firebase > scrapingJob()
```

Add credentials to `functions/.env`.

```
BSKY_ID=
BSKY_PASSWORD=
```
