import { google } from "googleapis";
import fs from "fs";
import path from "path";

const KEY_PATH = path.resolve(__dirname, "prfs_auth_key.json");
const ACCESS_TOKEN_PATH = path.resolve(__dirname, "prfs_auth_access_token");

(async () => {
  console.log("KEY_PATH: %s", KEY_PATH);

  const JWT = google.auth.JWT;
  const authClient = new JWT({
    keyFile: KEY_PATH,
    scopes: ["https://mail.google.com"],
    subject: "elden@taigalabs.xyz", // google admin email address to impersonate
  });

  // await authClient.authorize();

  const accessToken = await authClient.getAccessToken();
  console.log("access token: %s", accessToken);

  if (accessToken.token) {
    fs.writeFileSync(ACCESS_TOKEN_PATH, accessToken.token);
    console.log("Successfully created an access token file, path: %s", ACCESS_TOKEN_PATH);
  } else {
    throw new Error("token does not exist");
  }

  const gmail = google.gmail({
    version: "v1",
    auth: authClient,
  });

  const res = await gmail.users.messages.list({ userId: "me" });

  if (res.data.messages) {
    for (const msg of res.data.messages) {
      console.log("msg id: %s", msg.id);

      if (msg.id) {
        const payload = await gmail.users.messages.get({
          userId: "me",
          id: msg.id,
        });

        console.log("payload", payload.data.payload);
      }

      // gmail.users.watch();
    }
  }
})();
