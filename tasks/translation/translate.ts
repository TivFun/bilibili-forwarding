const apiKey = process.env.GOOGLE_API_KEY;
const effectiveModel = process.env.GOOGLE_MODEL;

export const translate = async (text: string) => {
  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY is not defined in the environment.");
  }
  const prompt = `Translate the following text to Simplified Chinese, if there are confusing short terms, keep them as what they are while they could be some terminologies. Only return the translated content, without any explanations or extra text: ${text}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${effectiveModel}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    }
  );
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `API request failed with status ${response.status}: ${errorBody}`
    );
  }
  const data = await response.json();

  try {
    // 4. Extract the translated text from the nested response object.
    const translatedText = data.candidates[0].content.parts[0].text;
    return translatedText.trim();
  } catch (error) {
    console.error(
      "Failed to parse translation response:",
      JSON.stringify(data, null, 2)
    );
    throw new Error("Could not extract translated text from API response.");
  }
};
