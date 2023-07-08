import { parse } from "node-html-parser";

export type News = {
  title: string;
  link: string;
};

export class HelloProjectBot {
  static async scrapingOfficialNews(): Promise<News[]> {
    const baseURL = "https://www.up-fc.jp";
    const category = "helloproject";

    // NOTE: 古い順に取得する必要がある
    return [
      ...(await HelloProjectBot.fetchNews(
        `${baseURL}/${category}/news.php?@PS@=none`
      )),
      ...(await HelloProjectBot.fetchNews(
        `${baseURL}/${category}/news.php?@Page@=2`
      )),
    ].reverse();
  }

  static async fetchNews(url: string): Promise<News[]> {
    const resp = await fetch(url);
    const html = parse(await resp.text());
    const a = html.querySelectorAll(".fanclubnews li a");
    return a
      .map((e): News | null => {
        if (e.getAttribute("href")) {
          return {
            title: e.innerText,
            link: `https://www.up-fc.jp/helloproject/${
              e.getAttribute("href") || ""
            }`,
          };
        } else {
          return null;
        }
      })
      .filter((e): e is News => e !== null);
  }
}
