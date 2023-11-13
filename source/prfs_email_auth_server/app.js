const { Auth, google } = require("googleapis");

const main = async () => {
  const auth = new Auth.GoogleAuth({
    keyFile: "prfs-auth-key.json",
    scopes: "https://www.googleapis.com/auth/gmail.imap_admin",
  });
  const client = await auth.getClient();

  // Obtain a new drive client, making sure you pass along the auth client
  const admin = google.admin({ version: "directory_v1", auth: client });

  const groups = await admin.groups.list();
  console.log(groups.data.groups);
};

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
