import { BilibiliPost } from "../types";

export function tweetStandardiser(rawContent: any) {
  const standardisedContent: BilibiliPost[] = rawContent.map((tweet: any) => ({
    text: tweet.text,
    media:
      tweet.extendedEntities?.media?.map((media: any) => ({
        mediaUrl: media.media_url_https,
        width: media.sizes?.large?.w,
        height: media.sizes?.large?.h,
      })) || [],
  }));
  return standardisedContent;
}
