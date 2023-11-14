import { google, gmail_v1 } from "googleapis";

// const auth = new google.auth.GoogleAuth({
//   keyFile: "prfs-auth-key.json",
//   scopes: ["https://mail.google.com/"],
// });

const auth = gmail_v1.Gmail({
  version: "v1",
  keyFile: "./google_service.json",
  scopes: ["https://www.googleapis.com/auth/gmail.send"],
});
