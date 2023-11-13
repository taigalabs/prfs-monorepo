import { Auth, google } from "googleapis";

const main = async () => {
  const auth = new Auth.GoogleAuth({
    keyFile: "prfs-auth-key.json",
    scopes: "https://www.googleapis.com/auth/gmail.readonly",
  });
  const client = await auth.getClient();

  // Obtain a new drive client, making sure you pass along the auth client
  const gmail = google.gmail({ version: "v1", auth: client });
  console.log(123, gmail);

  // const groups = await admin.groups.list();
  // console.log(groups.data.groups);
};

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
