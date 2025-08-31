import axios from "axios";
import FormData from "form-data";

const sessdata = process.env.SESSDATA;
const csrf = process.env.CSRF;

/**
 * Uploads an image from a URL to Bilibili's server.
 * @param imageUrl The URL of the image to upload.
 * @returns The Bilibili URL of the uploaded image.
 */
async function uploadImage(imageUrl: string): Promise<string> {
  const uploadApiUrl =
    "https://api.bilibili.com/x/dynamic/feed/draw/upload_bfs";

  // Step 1: Download the image data from the external URL.
  const imageResponse = await axios.get(imageUrl, {
    responseType: "arraybuffer",
  });
  const imageBuffer = Buffer.from(imageResponse.data, "binary");

  // Step 2: Prepare the multipart/form-data payload.
  const formData = new FormData();
  formData.append("file_up", imageBuffer, {
    filename: "image.png",
    contentType: imageResponse.headers["content-type"],
  });
  formData.append("biz", "dynamic");
  formData.append("csrf", csrf);

  // Step 3: Post the image data to Bilibili's upload endpoint.
  const response = await axios.post(uploadApiUrl, formData, {
    headers: {
      ...formData.getHeaders(),
      Cookie: `SESSDATA=${sessdata}; bili_jct=${csrf};`,
    },
  });

  if (response.data.code === 0 && response.data.data.image_url) {
    console.log("Image uploaded successfully:", response.data.data.image_url);
    return response.data.data.image_url;
  } else {
    throw new Error(
      `Failed to upload image: ${response.data.message || "Unknown error"}`
    );
  }
}

export async function postToBilibili(content: any) {
  const apiUrl = "https://api.bilibili.com/x/dynamic/feed/create/dyn";

  const hasMedia = content.media && content.media.length > 0;
  let bilibiliPics: any[] = [];

  // If there are images, upload them first.
  if (hasMedia) {
    console.log("Uploading images to Bilibili...");
    const uploadedUrls = await Promise.all(
      content.media.map((url: string) => uploadImage(url))
    );
    bilibiliPics = uploadedUrls.map((url) => ({
      img_src: url,
      img_width: 0,
      img_height: 0,
    }));
  }

  const scene = hasMedia ? 2 : 1;

  const requestBody = {
    dyn_req: {
      content: {
        contents: [{ raw_text: content.text }],
      },
      meta: {
        app_meta: {
          from: "create.dynamic.web",
          mobi_app: "web",
        },
      },
      pics: bilibiliPics, // Use the uploaded image data.
      scene: scene,
    },
  };

  try {
    const response = await axios.post(apiUrl, requestBody, {
      params: {
        csrf: csrf,
      },
      headers: {
        "Content-Type": "application/json",
        Cookie: `SESSDATA=${sessdata}; bili_jct=${csrf};`,
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
      },
    });

    if (response.data.code === 0) {
      console.log("Posted", response.data);
      return response.data;
    } else {
      console.error("Failed to post:", response.data);
      throw new Error(`Failed to post dynamic: ${response.data.message}`);
    }
  } catch (error) {
    console.error("Error posting to Bilibili:", error);
    throw error;
  }
}
