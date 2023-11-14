use base64;
use google_oauth::AsyncClient;
use imap;
use prfs_email_auth_server::{envs::ENVS, paths::PATHS};

#[tokio::main]
async fn main() {
    run_imap();
}

fn run_imap() {
    let domain = "https://imap.gmail.com";
    let username = &ENVS.gmail_account;

    let access_token = std::fs::read_to_string(&PATHS.access_token).unwrap();

    println!("username: {}, access_token: {}", username, access_token);

    let gmail_auth = GmailOAuth2 {
        user: String::from(username),
        access_token: String::from(access_token),
    };

    let tls = native_tls::TlsConnector::builder().build().unwrap();

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
