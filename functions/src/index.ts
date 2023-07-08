import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { HelloProjectBot, News } from "./lib/helloProjectBot";
import {
  bulkInsert,
  getUntweetedItem,
  updateTweetedFlag,
} from "./lib/firestore";
import { BskyClient } from "./lib/bskyClient";
import { defineString } from "firebase-functions/params";

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();
const helloProjectOfficialNewsRef = db
  .collection("v1")
  .doc("helloProjectOfficialNews")
  .collection("all");

export const scrapingJob = functions.pubsub
  .schedule("05 0-23/1 * * *")
  .onRun(async (_) => {
    const scrapingHelloProjectOfficialNews = async () => {
      const news = await HelloProjectBot.scrapingOfficialNews();
      await bulkInsert(helloProjectOfficialNewsRef, news);
    };

    try {
      await Promise.all([scrapingHelloProjectOfficialNews()]);
    } catch (e) {
      console.log(e);
    }
  });

export const postJob = functions.pubsub
  .schedule("01 * * * *")
  .onRun(async (_) => {
    const postHelloProjectOfficialNews = async () => {
      const snapshot = await getUntweetedItem(helloProjectOfficialNewsRef);
      if (snapshot.empty) {
        return;
      }
      const doc = snapshot.docs.at(0)!;
      const item = doc.data() as News;

      const agent = await BskyClient.createAgent({
        identifier: defineString("BSKY_ID").value(),
        password: defineString("BSKY_PASSWORD").value(),
      });
      await agent.post({
        text: item.title.slice(0, 299),
      });

      await updateTweetedFlag(doc, true);
    };

    try {
      await Promise.all([postHelloProjectOfficialNews()]);
    } catch (e) {
      console.log(e);
    }
  });
