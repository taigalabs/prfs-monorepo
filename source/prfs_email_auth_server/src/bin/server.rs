use base64;
use google_oauth::AsyncClient;
use imap;
use prfs_email_auth_server::envs::ENVS;

#[tokio::main]
async fn main() {
    let client_id = &ENVS.google_oauth_client_id;
    let id_token = &ENVS.google_oauth_client_secret;
    println!(
        "google oauth client_id: {}, id_token: {}",
        client_id, id_token
    );

    let client = AsyncClient::new(client_id);
    let access_token = "ya29.c.c0AY_VpZimmKa17MEEXJObDkJNoRvzk0U7rdRvEs8B8GDEbv7eVGrjq-8McBRj9EpxK9ZkDN9F8SbNP43W6vrqFG1YOWyGcy6EwHtgDl6fEZXr2RwJD6VmttOoU-Z9jik16xGTO8JtuViqLOUfYs9wX3QOp32GcbuLg6W47bFk5c3RSyDYv9ybNNg2PiIs7b4GtzDP7_akcOFeSbTvcsWvyznPEpIpCYP82BJn6eZksCR-TDR7mPyUH03iwAs--4JePswknIRbqFk-pkR3vaA9V5Q3iv74UMJEHprWNj1gw6fTw_WXMQXHwsDv7XlXsVaSGYcVDkL2EIED46QA91vw_-DHZRXkIvJ0wFVmWJUy-LNj8jbrwZ00e6iZG385Kfjv0R3Q_5bhU7W_2QvlZhXBZ_Jh2QSZJeiMai8hZXr8QYjtZlxneQi-I3kkSQaXrI0ffn5I6qhMWyIm9nZyuYrnZzq_IVrpMrWUUm1W864pv49gucdmwcwfVb9uQmZo7ca_Wrs1ioinW32Mhg4O6Qw9Yals7dv5dh4x7SxIZwYhSSlRuRIjYyWzF8zhJU54_X0Y8vweBf0ZasW-SssoWi6YowuYXydFm4R_nzqjju683qlx7Xe-1z-QWt-atbykhtUcguegXgVz3OBtBR9peqFV6jyny54XYIlsY-gkO9S5rwnQtS1skVV7zn654SslUUkMR94mtSaZuuwx6zyuoh18nd5-6nsmdctWBBtQxd8iIgUa9h8wJ76_IOBu1mXy6icy18FJ0djqrX7i6RU8qY9XjWfBuFt8ptu3m8Rec_xUYOjvQVtfyBJ3abz531mRspsdr8tz3UvMOpXuX9maY_SWoohZrk7tVb7rf8m5BOnUJuaVBJaQpYuMWlaic7xjb33jlx5fmSXh2j92nmS4mjbaYhezX819eurnUoMeXU43F_WaQbzSivvqVRe8cdjOphjSeQIqjF210vw3xBXpgjF63B1uJOzW-YhZ_Oe4hzur2hwVVxsrnyBOb0n";
    let payload = client.validate_access_token(access_token).await.unwrap(); // In production, remember to handle this error.

    // When we get the payload, that mean the id_token is valid.
    // Usually we use `sub` as the identifier for our user...
    println!("Hello, I am {}", &payload.sub);

    // run_imap();
}

fn run_imap() {
    let domain = "imap.gmail.com";
    let username = &ENVS.gmail_account;
    let password = &ENVS.gmail_pw;

    println!("username: {}, password: {}", username, password);

    let gmail_auth = GmailOAuth2 {
        user: String::from(username),
        access_token: String::from("<access_token>"),
    };

    let tls = native_tls::TlsConnector::builder().build().unwrap();

    // let client = imap::ClientBuilder::new("imap.gmail.com", 993)
    //     .connect()
    //     .expect("Could not connect to imap.gmail.com");

    let client = imap::connect((domain, 993), domain, &tls).unwrap();

    let mut imap_session = match client.authenticate("XOAUTH2", &gmail_auth) {
        Ok(c) => c,
        Err((e, _unauth_client)) => {
            println!("error authenticating: {}", e);
            return;
        }
    };

    match imap_session.select("INBOX") {
        Ok(mailbox) => println!("{}", mailbox),
        Err(e) => println!("Error selecting INBOX: {}", e),
    };

    match imap_session.fetch("2", "body[text]") {
        Ok(msgs) => {
            for msg in msgs.iter() {
                print!("{:?}", msg);
            }
        }
        Err(e) => println!("Error Fetching email 2: {}", e),
    };

    imap_session.logout().unwrap();
}

struct GmailOAuth2 {
    user: String,
    access_token: String,
}

impl imap::Authenticator for GmailOAuth2 {
    type Response = String;
    #[allow(unused_variables)]
    fn process(&self, data: &[u8]) -> Self::Response {
        format!(
            "user={}\x01auth=Bearer {}\x01\x01",
            self.user, self.access_token
        )
    }
}
