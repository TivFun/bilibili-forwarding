import { fetchTweets } from "./tweets/fetch-tweets";
import { translate } from "./translation/translate";
import { postToBilibili } from "./post/post";
interface Tweet {
  text: string;
  url: string;
  media: string[];
  created_at: string;
}
export const integralProcess = async () => {
  let FetchedTweets = await fetchTweets();
  let trimmedTweets: Tweet[] = [];
  for (let i = 0; i < FetchedTweets.length; i++) {
    let tweet = FetchedTweets[i];
    let trimmedTweet: Tweet = {
      text: tweet.text,
      url: tweet.url,
      media:
        tweet.extendedEntities?.media?.map(
          (media: any) => media.media_url_https
        ) || [],
      created_at: tweet.createdAt,
    };
    trimmedTweets.push(trimmedTweet);
  }
  let translatedTweets: Tweet[] = [];
  for (let i = 0; i < trimmedTweets.length; i++) {
    let tweet = trimmedTweets[i];
    let translatedTweet: Tweet = {
      text: await translate(tweet.text),
      url: tweet.url,
      media: tweet.media,
      created_at: tweet.created_at,
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
