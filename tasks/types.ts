import { postToBilibili } from "./post/bilibili-poster";

export interface BilibiliPost {
  text: string;
  media: {
    mediaUrl: string;
    width: number;
    height: number;
  }[];
}
