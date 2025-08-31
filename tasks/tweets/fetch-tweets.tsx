import "dotenv/config";

const apiKey = process.env.TWITTERAPI_IO_API_KEY;
const target = process.env.TWITTER_USERNAME;

function formatTimeForAPI(date: Date): string {
  return date.toISOString().replace(/T/, "_").replace(/\..+/, "_UTC");
}

export const fetchTweets = async () => {
  try {
    if (!apiKey) {
      throw new Error(
        "TWITTERAPI_IO_API_KEY is not defined in the environment."
      );
    }

    const currentTime = new Date();
    console.log("Current system time in UTC:", currentTime.toISOString());

    const sinceTime = new Date(currentTime.getTime() - 15 * 60 * 1000);
    const sinceStr = formatTimeForAPI(sinceTime);
    const untilStr = formatTimeForAPI(currentTime);
    const query = `from:${target} since:${sinceStr} until:${untilStr}`;
    console.log("Executing query:", query);

    const response = await fetch(
      `https://api.twitterapi.io/twitter/tweet/advanced_search?query=${encodeURIComponent(
        query
      )}&queryType=Latest`,
      {
        headers: {
          "X-API-Key": apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("data", data.tweets);
    return data.tweets || [];
  } catch (error) {
    console.error("Failed to get tweets:", error);
    return [];
  }
};

if (require.main === module) {
  fetchTweets();
}
