import { fetchTweets } from "./tweets/fetch-tweets";
import { translate } from "./translation/translate";
import { postToBilibili } from "./post/post";
interface Tweet {
  text: string;
  media: {
    mediaUrl: string;
    width: number;
    height: number;
  }[];
}
export const integralProcess = async () => {
  let FetchedTweets = await fetchTweets();
  let trimmedTweets: Tweet[] = [];
  for (let i = 0; i < FetchedTweets.length; i++) {
    let tweet = FetchedTweets[i];
    let trimmedTweet: Tweet = {
      text: tweet.text,
      media:
        tweet.extendedEntities?.media?.map((media: any) => ({
          mediaUrl: media.media_url_https,
          width: media.sizes?.large?.w,
          height: media.sizes?.large?.h,
        })) || [],
    };
    trimmedTweets.push(trimmedTweet);
  }
  let translatedTweets: Tweet[] = [];
  for (let i = 0; i < trimmedTweets.length; i++) {
    let tweet = trimmedTweets[i];
    let translatedTweet: Tweet = {
      ...tweet,
      text: await translate(tweet.text),
    };
    translatedTweets.push(translatedTweet);
  }

  for (let i = 0; i < translatedTweets.length; i++) {
    let tweet = translatedTweets[i];
    await postToBilibili(tweet);
  }
};

if (require.main === module) {
  integralProcess();
}
