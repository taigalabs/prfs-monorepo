import { google } from "googleapis";
import path from "path";

const KEY_PATH = path.resolve(__dirname, "prfs-auth-key.json");

(async () => {
  console.log("KEY_PATH: %s", KEY_PATH);

  const JWT = google.auth.JWT;
  const authClient = new JWT({
    keyFile: KEY_PATH,
    scopes: ["https://mail.google.com"],
    subject: "elden@taigalabs.xyz", // google admin email address to impersonate
  });

  await authClient.authorize();

  const gmail = google.gmail({
    version: "v1",
    auth: authClient,
  });

  const res = await gmail.users.messages.list({ userId: "me" });
  console.log(44, res.data);
})();
