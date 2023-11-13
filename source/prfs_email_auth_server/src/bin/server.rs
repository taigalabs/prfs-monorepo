use base64;
use imap;
use prfs_email_auth_server::envs::ENVS;

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

fn main() {
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
