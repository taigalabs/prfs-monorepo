import { Auth, google } from "googleapis";

const main = async () => {
  const auth = new Auth.GoogleAuth({
    keyFile: "prfs-auth-key.json",
    scopes: "https://www.googleapis.com/auth/gmail.readonly",
  });

  const a = await auth.getAccessToken();
  console.log(11, a);
  const client = await auth.getClient();

  // // Obtain a new drive client, making sure you pass along the auth client
  // const gmail = google.gmail({ version: "v1", auth: client });
  // gmail.users.messages.list(
  //   {
  //     userId: "me",
  //     q: "label:inbox",
  //   },
  //   (err, res) => {
  //     console.log(123, err);
  //     console.log(123333, res);
  //     if (err) {
  //       // reject(err);
  //       return;
  //     }
  //     // if (!res.data.messages) {
  //     //   resolve([]);
  //     //   return;
  //     // }
  //     // resolve(res.data.messages);
  //   },
  // );
  // console.log(123, gmail);

  // const groups = await admin.groups.list();
  // console.log(groups.data.groups);
};

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
