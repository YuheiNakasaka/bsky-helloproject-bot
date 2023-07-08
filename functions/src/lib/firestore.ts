import dayjs = require("dayjs");
import { News } from "./helloProjectBot";

export const bulkInsert = async (
  collectionRef: FirebaseFirestore.CollectionReference,
  items: News[]
): Promise<void> => {
  let startIndex = 0;
  const snapshot = await collectionRef
    .orderBy("createdAt", "desc")
    .limit(1)
    .get();

  if (snapshot.docs.length > 0) {
    const doc = snapshot.docs[0].data();
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.link === doc.link) {
        startIndex = i + 1;
        break;
      }
    }
  }

  const insertItems = items.slice(startIndex);
  await Promise.all([
    insertItems.map(async (item, i) => {
      return await collectionRef.add({
        ...item,
        createdAt: dayjs().unix() + i * 1000,
        tweeted: false,
      });
    }),
  ]);
};

export const getUntweetedItem = async (
  collectionRef: FirebaseFirestore.CollectionReference
): Promise<FirebaseFirestore.QuerySnapshot> => {
  return await collectionRef.where("tweeted", "==", false).limit(1).get();
};

export const updateTweetedFlag = async (
  doc: FirebaseFirestore.QueryDocumentSnapshot,
  tweeted: boolean
): Promise<void> => {
  await doc.ref.update({ tweeted });
};
