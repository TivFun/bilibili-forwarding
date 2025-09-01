import { fetchTweets } from "./tweets/fetch-tweets";
import { translate } from "./translation/translate";
import { postToBilibili } from "./post/bilibili-poster";
import { BilibiliPost } from "./types";
import { tweetStandardiser } from "./tweets/tweet-standardiser";
export const integralProcess = async () => {
  // fetch tweets
  let rawContent = await fetchTweets();

  // standardise tweets
  let standardisedContent: BilibiliPost[] = tweetStandardiser(rawContent);

  // translating process
  let translatedContent: BilibiliPost[] = await Promise.all(
    standardisedContent.map(async (item) => ({
      ...item,
      text: await translate(item.text),
    }))
  );

  // post to bilibili
  await Promise.all(
    translatedContent.map(async (item) => {
      await postToBilibili(item);
    })
  );
};

if (require.main === module) {
  integralProcess();
}
