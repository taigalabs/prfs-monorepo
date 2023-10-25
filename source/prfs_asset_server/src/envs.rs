use colored::Colorize;
use dotenvy::dotenv;
use lazy_static::lazy_static;
use serde::Deserialize;

lazy_static! {
    pub static ref ENVS: Envs = Envs::new();
}

#[derive(Deserialize, Debug)]
pub struct Envs {
    #[serde(default = "default_aws_access_key_id")]
    pub aws_access_key_id: String,

    #[serde(default = "default_aws_secret_access_key")]
    pub aws_secret_access_key: String,

    #[serde(default = "default_aws_default_region")]
    pub aws_default_region: String,
}

impl Envs {
    pub fn new() -> Envs {
        dotenv().expect("Env not found");

        match envy::from_env::<Envs>() {
            Ok(envs) => {
                println!("{} dot env {:#?}", "Loaded".green(), envs);

                return envs;
            }
            Err(error) => panic!("Dot env is invalid, {:#?}", error),
        };
    }

    pub fn check(&self) {}
}

fn default_aws_access_key_id() -> String {
    "NOT_NEEDED_IN_DEVELOPMENT".to_string()
}

fn default_aws_secret_access_key() -> String {
    "NOT_NEEDED_IN_DEVELOPMENT".to_string()
}
fn default_aws_default_region() -> String {
    "NOT_NEEDED_IN_DEVELOPMENT".to_string()
}
