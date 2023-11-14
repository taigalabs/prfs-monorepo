use base64;
use google_oauth::AsyncClient;
use imap;
use prfs_email_auth_server::envs::ENVS;

#[tokio::main]
async fn main() {
    // let client_id = &ENVS.google_oauth_client_id;
    // let id_token = &ENVS.google_oauth_client_secret;
    // println!(
    //     "google oauth client_id: {}, id_token: {}",
    //     client_id, id_token
    // );

    // let client = AsyncClient::new(client_id);
    // let access_token = "ya29.c.c0AY_VpZimmKa17MEEXJObDkJNoRvzk0U7rdRvEs8B8GDEbv7eVGrjq-8McBRj9EpxK9ZkDN9F8SbNP43W6vrqFG1YOWyGcy6EwHtgDl6fEZXr2RwJD6VmttOoU-Z9jik16xGTO8JtuViqLOUfYs9wX3QOp32GcbuLg6W47bFk5c3RSyDYv9ybNNg2PiIs7b4GtzDP7_akcOFeSbTvcsWvyznPEpIpCYP82BJn6eZksCR-TDR7mPyUH03iwAs--4JePswknIRbqFk-pkR3vaA9V5Q3iv74UMJEHprWNj1gw6fTw_WXMQXHwsDv7XlXsVaSGYcVDkL2EIED46QA91vw_-DHZRXkIvJ0wFVmWJUy-LNj8jbrwZ00e6iZG385Kfjv0R3Q_5bhU7W_2QvlZhXBZ_Jh2QSZJeiMai8hZXr8QYjtZlxneQi-I3kkSQ";
    // let access_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ii0tLS0tQkVHSU4gUFJJVkFURSBLRVktLS0tLVxuTUlJRXZRSUJBREFOQmdrcWhraUc5dzBCQVFFRkFBU0NCS2N3Z2dTakFnRUFBb0lCQVFERmpmemFMbGlIeHVKdVxud3NIeU9rQlk1eHJyaHRETzJBOGU0dzZmYm9LakwyVzcxbmxjWDhUQm5jWEo1dHlYVHoycW9BNndlZ2tpWmpZaVxuZ2RpRndvalllRG53MGhzbkdoaWlNckhyQ0hvZHZodG9IeTA5azF5MEJwZDE2UHh0L3Z5ZzFQWVBzY0J4SmFqeVxueDdvMER2ZTB5WS9YdlZMRUpPYXhLNXlFWndrM0x2NVJMNlR2cUkvOFNtVFp3Q1hBd1Q5M2VhYVpXQzdmSVI3ZVxubE5Cczh3VnEweTVuTlpvRG5jeUV2Q2hFSlRRYWxEM09GN085ODNteWtCanpxUEsyRDFFZ3Y0bm5oZnRKSVVmSVxuZEVwWDJPcHVrSGhaUWlCSkhlbzN1ZFdGVUZyZm03MWZwWmJ4cy9qQzB6QmJJdHBPV0ZGS2U2ekFoTWdPalgvNFxuaFNQcEErN3ZBZ01CQUFFQ2dnRUFNcnEwVEY2TVUwbHFDZUV2Sm9GNDFwdDUyVE5FV1drMzhNbURqc00wL3F5RVxuSmtqNzN4R2tsOGRvNitEQmtvVkJvNWY0VGE3NHU0R2RzeHkrdWhKclM1TUw1ZUErSXJ0YnlnTFVsek1WRUtBcFxucjRJWi91N2haa1V2RFpNbmh5TnNRZXlOeHhmdy85MFkxa2NkZEpMSFh3QkhWTElFRitRVjdUYnl1VGt3TDZBSlxuSExXMzF3L1VZeUZxYTA1eTUrMUg1enZUTjQ0b210YWRjSlQ5bVVYazdiTjhUdzFOL2hDOG43bERrUnE3c0hselxuRnVYV1huY3dMbFhOcHppWFZqeCtEODNCa2FCWG83dytVMEMvMUQ4MjkxTXFsZHVEb1FEWUp4NitlKzJ3RWsralxucWNVWkNUazhNTTBCdUYzWExhWUhOK0tzbUJkYXFJSm9TWkV1Q3BQRCtRS0JnUURtUi9VU2xQK3RJeVpCY2QvbVxuODV0OWtPR1pldEVLL1BvT1V3RitMWklsVnMxajFrWGRZMkxwS3QwM0xGd2o1czFGNXRKbkZBWWQxUVF3ZkVRN1xuc2lrRTdRb0M3NjcvQ29RcmpaMGMxditiTDM4a1p1RXdMMFZvaWpLTFRhK0IrQXluQ0dNNnpseFVCMzVoY2JISFxuZmp6NDBGWnMvcVFHWjRYMTdRRklpTnFWSFFLQmdRRGJubFo2SUFJRlNkVmM4Ty9GKzdWRXV0MHlpTnBZc3U2RVxubThqbEJjZG1aNmFvQXd2YzRuT0d4Ni9UaDl5VlRYdXRLWkNqdnpjY2VFQktTeGZEMDROcWk0dUZqQy9kTWkvNlxueVdPMytncDRrWmNDeXBGWmlxSmhaaHhIMldkUTdRb2kzb0xrTjkvTVg0NG1JWUVGdlE3M0Y1NjlHeitQZUg3VlxuWTd5U2x6ZFNld0tCZ1FDVkpSbTNGVVdiRDE3aG1DMVoyWUZsakFaeGJ6Z2hFOE9vcjE0U0tOVzAxVWxsVmd3ZFxuM1JiY3lXUkpMYlBubEw1eWZaTGNLLzNpS0dyME5DZkZPaGlURmlzYng3emhkaUF3VFNIcTRkemUxNTVUSjBiRlxuL0hmSncyZ0ZEU1dVMmVEbjllaSsxNVM0MzdtY3h4UkxqcGxTMVN5RW4xQUF6ZC9YYmM4YytYWUlpUUtCZ0dTK1xuTW04ZEpiQWxXV0drQ0dscWVKR0pvcFJlNE1KVmVrS01iOUJYSVV3aGVmcVNReXZWR1NlWGpGbGRkbHRxeXJQNVxuWUNjdFBPdXJZZHB5cmZrZm1xWVNVek0weG5RU1pKNEhLZDRvTGd0MnhhMzdIRWZWNTMwRWFTNndWTXR6b1BXelxuMnBrejVFNk0rdGtVLzJtUmV6N3ZyOXFSbUV1SSs2MkpiZVJVeDRUbkFvR0FmR0VsSTlQQWlBNS9xVVUrREJ4elxuQ3J2cjIyeXpVQS82M3hXTjZ1QWhsQzVOTzVFNEk0MW83TFovMjNibllRQ3prOXNkcWIybkkwcldRN2ZqUCtTcFxuMVpVbjJ6WnhFaGZyeS9iZ3BSeiswWGc2RXVKZnBMeVJPb3VxUFo0Q3Z1OE53emhuM3R0T25nSng3eGRPZG8yZFxuMW9iWkdYUHVJb0c2aldSUE1yc2dieFU9XG4tLS0tLUVORCBQUklWQVRFIEtFWS0tLS0tXG4ifQ.eyJpc3MiOiJwcmZzLWF1dGhlbnRpY2F0aW9uQHByZnMtYXV0aC5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInN1YiI6InByZnMtYXV0aGVudGljYXRpb25AcHJmcy1hdXRoLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwiYXVkIjoiaHR0cHM6Ly9nbWFpbC5nb29nbGVhcGlzLmNvbS8iLCJpYXQiOjE2OTk5MTAzNDYuMjQ2NjkzOCwiZXhwIjoxNjk5OTEzOTQ2LjI0NjY5Mzh9.S6e8Ry3d_s1bIEPF0vC6DI-Q2_VjGO6Jx5ET5JPHD-MpUPtGTY0NbGhsv6Nn7PEQl9m9SHdq2ByOEwv1PW0lcNJ5juLLhDvNfUbgWPdfkeH9Cy3QNC2N1l0KJfi1hJiy8g1_RrYpATv_ys0LH1hmcrAAi6UN3zdyvrgPPU5-gIVR7B-uGADadfH0HE3dpnbHN9eemLbFkNWw-GmofBc6j6BJtV7gbCPM6YS5NiFx_WLlF8aieWao0Eb09ZlllpVvCN5Ytl6-55hdm1qbXvou42pcvnhXdtmsUJoL76PyK7Ru398tS9no5YdFEdQdPSLAYOdthLjTpcFKi0JfjA-i4g";
    // let payload = client.validate_access_token(access_token).await.unwrap(); // In production, remember to handle this error.

    // // When we get the payload, that mean the id_token is valid.
    // // Usually we use `sub` as the identifier for our user...
    // println!("Hello, I am {}", &payload.sub);

    run_imap();
}

fn run_imap() {
    let domain = "imap.gmail.com";
    let username = &ENVS.gmail_account;
    let password = &ENVS.gmail_pw;
    let access_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ii0tLS0tQkVHSU4gUFJJVkFURSBLRVktLS0tLVxuTUlJRXZRSUJBREFOQmdrcWhraUc5dzBCQVFFRkFBU0NCS2N3Z2dTakFnRUFBb0lCQVFERmpmemFMbGlIeHVKdVxud3NIeU9rQlk1eHJyaHRETzJBOGU0dzZmYm9LakwyVzcxbmxjWDhUQm5jWEo1dHlYVHoycW9BNndlZ2tpWmpZaVxuZ2RpRndvalllRG53MGhzbkdoaWlNckhyQ0hvZHZodG9IeTA5azF5MEJwZDE2UHh0L3Z5ZzFQWVBzY0J4SmFqeVxueDdvMER2ZTB5WS9YdlZMRUpPYXhLNXlFWndrM0x2NVJMNlR2cUkvOFNtVFp3Q1hBd1Q5M2VhYVpXQzdmSVI3ZVxubE5Cczh3VnEweTVuTlpvRG5jeUV2Q2hFSlRRYWxEM09GN085ODNteWtCanpxUEsyRDFFZ3Y0bm5oZnRKSVVmSVxuZEVwWDJPcHVrSGhaUWlCSkhlbzN1ZFdGVUZyZm03MWZwWmJ4cy9qQzB6QmJJdHBPV0ZGS2U2ekFoTWdPalgvNFxuaFNQcEErN3ZBZ01CQUFFQ2dnRUFNcnEwVEY2TVUwbHFDZUV2Sm9GNDFwdDUyVE5FV1drMzhNbURqc00wL3F5RVxuSmtqNzN4R2tsOGRvNitEQmtvVkJvNWY0VGE3NHU0R2RzeHkrdWhKclM1TUw1ZUErSXJ0YnlnTFVsek1WRUtBcFxucjRJWi91N2haa1V2RFpNbmh5TnNRZXlOeHhmdy85MFkxa2NkZEpMSFh3QkhWTElFRitRVjdUYnl1VGt3TDZBSlxuSExXMzF3L1VZeUZxYTA1eTUrMUg1enZUTjQ0b210YWRjSlQ5bVVYazdiTjhUdzFOL2hDOG43bERrUnE3c0hselxuRnVYV1huY3dMbFhOcHppWFZqeCtEODNCa2FCWG83dytVMEMvMUQ4MjkxTXFsZHVEb1FEWUp4NitlKzJ3RWsralxucWNVWkNUazhNTTBCdUYzWExhWUhOK0tzbUJkYXFJSm9TWkV1Q3BQRCtRS0JnUURtUi9VU2xQK3RJeVpCY2QvbVxuODV0OWtPR1pldEVLL1BvT1V3RitMWklsVnMxajFrWGRZMkxwS3QwM0xGd2o1czFGNXRKbkZBWWQxUVF3ZkVRN1xuc2lrRTdRb0M3NjcvQ29RcmpaMGMxditiTDM4a1p1RXdMMFZvaWpLTFRhK0IrQXluQ0dNNnpseFVCMzVoY2JISFxuZmp6NDBGWnMvcVFHWjRYMTdRRklpTnFWSFFLQmdRRGJubFo2SUFJRlNkVmM4Ty9GKzdWRXV0MHlpTnBZc3U2RVxubThqbEJjZG1aNmFvQXd2YzRuT0d4Ni9UaDl5VlRYdXRLWkNqdnpjY2VFQktTeGZEMDROcWk0dUZqQy9kTWkvNlxueVdPMytncDRrWmNDeXBGWmlxSmhaaHhIMldkUTdRb2kzb0xrTjkvTVg0NG1JWUVGdlE3M0Y1NjlHeitQZUg3VlxuWTd5U2x6ZFNld0tCZ1FDVkpSbTNGVVdiRDE3aG1DMVoyWUZsakFaeGJ6Z2hFOE9vcjE0U0tOVzAxVWxsVmd3ZFxuM1JiY3lXUkpMYlBubEw1eWZaTGNLLzNpS0dyME5DZkZPaGlURmlzYng3emhkaUF3VFNIcTRkemUxNTVUSjBiRlxuL0hmSncyZ0ZEU1dVMmVEbjllaSsxNVM0MzdtY3h4UkxqcGxTMVN5RW4xQUF6ZC9YYmM4YytYWUlpUUtCZ0dTK1xuTW04ZEpiQWxXV0drQ0dscWVKR0pvcFJlNE1KVmVrS01iOUJYSVV3aGVmcVNReXZWR1NlWGpGbGRkbHRxeXJQNVxuWUNjdFBPdXJZZHB5cmZrZm1xWVNVek0weG5RU1pKNEhLZDRvTGd0MnhhMzdIRWZWNTMwRWFTNndWTXR6b1BXelxuMnBrejVFNk0rdGtVLzJtUmV6N3ZyOXFSbUV1SSs2MkpiZVJVeDRUbkFvR0FmR0VsSTlQQWlBNS9xVVUrREJ4elxuQ3J2cjIyeXpVQS82M3hXTjZ1QWhsQzVOTzVFNEk0MW83TFovMjNibllRQ3prOXNkcWIybkkwcldRN2ZqUCtTcFxuMVpVbjJ6WnhFaGZyeS9iZ3BSeiswWGc2RXVKZnBMeVJPb3VxUFo0Q3Z1OE53emhuM3R0T25nSng3eGRPZG8yZFxuMW9iWkdYUHVJb0c2aldSUE1yc2dieFU9XG4tLS0tLUVORCBQUklWQVRFIEtFWS0tLS0tXG4ifQ.eyJpc3MiOiJwcmZzLWF1dGhlbnRpY2F0aW9uQHByZnMtYXV0aC5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInN1YiI6InByZnMtYXV0aGVudGljYXRpb25AcHJmcy1hdXRoLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwiYXVkIjoiaHR0cHM6Ly9nbWFpbC5nb29nbGVhcGlzLmNvbS8iLCJpYXQiOjE2OTk5MTAzNDYuMjQ2NjkzOCwiZXhwIjoxNjk5OTEzOTQ2LjI0NjY5Mzh9.S6e8Ry3d_s1bIEPF0vC6DI-Q2_VjGO6Jx5ET5JPHD-MpUPtGTY0NbGhsv6Nn7PEQl9m9SHdq2ByOEwv1PW0lcNJ5juLLhDvNfUbgWPdfkeH9Cy3QNC2N1l0KJfi1hJiy8g1_RrYpATv_ys0LH1hmcrAAi6UN3zdyvrgPPU5-gIVR7B-uGADadfH0HE3dpnbHN9eemLbFkNWw-GmofBc6j6BJtV7gbCPM6YS5NiFx_WLlF8aieWao0Eb09ZlllpVvCN5Ytl6-55hdm1qbXvou42pcvnhXdtmsUJoL76PyK7Ru398tS9no5YdFEdQdPSLAYOdthLjTpcFKi0JfjA-i4g";

    println!("username: {}, password: {}", username, password);

    let gmail_auth = GmailOAuth2 {
        user: String::from(username),
        access_token: String::from(access_token),
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
