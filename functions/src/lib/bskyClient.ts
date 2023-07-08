import { AppBskyFeedPost, BskyAgent } from "@atproto/api";

export class BskyClient {
  private service = "https://bsky.social";
  agent: BskyAgent;
  private constructor() {
    this.agent = new BskyAgent({ service: this.service });
  }

  public static async createAgent({
    identifier,
    password,
  }: {
    identifier: string;
    password: string;
  }): Promise<BskyClient> {
    const client = new BskyClient();
    await client.agent.login({ identifier, password });
    return client;
  }

  public async post({
    text,
    embed,
  }: {
    text: string;
    embed?: AppBskyFeedPost.Record["embed"];
  }): Promise<{ cid: string; uri: string }> {
    const postParams: AppBskyFeedPost.Record = {
      $type: "app.bsky.feed.post",
      text,
      createdAt: new Date().toISOString(),
    };
    if (embed) {
      postParams.embed = embed;
    }
    return await this.agent.post(postParams);
  }
}
