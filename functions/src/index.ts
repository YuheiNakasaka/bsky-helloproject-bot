import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { HelloProjectBot } from "./lib/helloProjectBot";
import { bulkInsert } from "./lib/firestore";

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();
const helloProjectOfficialNewsRef = db
  .collection("v1")
  .doc("helloProjectOfficialNews")
  .collection("all");

export const scrapingJob = functions.pubsub
  .schedule("every 60 minutes")
  .onRun(async (_) => {
    const scrapingHelloProjectOfficialNews = async () => {
      const news = await HelloProjectBot.scrapingOfficialNews();
      await bulkInsert(helloProjectOfficialNewsRef, news);
    };

    await Promise.all([scrapingHelloProjectOfficialNews()]);
  });
