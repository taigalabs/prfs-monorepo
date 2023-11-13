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
    /// or, if you want to set the default timeout for fetching certificates from Google, e.g, 30 seconds, you can:
    /// ```rust
    /// let client = AsyncClient::new(client_id).timeout(time::Duration::from_sec(30));
    /// ```
    let payload = client.validate_id_token(id_token).await.unwrap(); // In production, remember to handle this error.

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
