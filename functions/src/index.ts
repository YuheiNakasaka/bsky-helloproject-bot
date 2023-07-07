import * as functions from "firebase-functions";
import { defineString } from "firebase-functions/params";
import * as admin from "firebase-admin";

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

export const helloWorld = functions.pubsub
  .schedule("every 5 minutes")
  .onRun((context) => {
    const env = defineString("MY_ENV");
    console.log(`Hello ${env.value()}!`);

    const ref = db.collection("test");
    ref
      .doc("rYkC9z5f3t7DjN7qdDfQ")
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log(doc.data());
        } else {
          console.log("No such document!");
        }
      });

    return null;
  });
