use colored::Colorize;
use dotenvy::dotenv;
use lazy_static::lazy_static;
use serde::Deserialize;

use crate::paths::PATHS;

lazy_static! {
    pub static ref ENVS: Envs = Envs::new();
}

#[derive(Deserialize, Debug)]
pub struct Envs {
    #[serde(default = "default_postgres_endpoint")]
    pub postgres_endpoint: String,

    #[serde(default = "default_postgres_username")]
    pub postgres_username: String,

    #[serde(default = "default_postgres_pw")]
    pub postgres_pw: String,

    #[serde(default = "default_prfs_api_server_endpoint")]
    pub prfs_api_server_endpoint: String,
}

impl Envs {
    pub fn new() -> Envs {
        let env_path = PATHS.package_root.join(".env");

        dotenvy::from_path(&env_path).expect(&format!(
            "{}, Failed to locate .env, path: {:?}",
            env!("CARGO_PKG_NAME"),
            env_path
        ));

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

fn default_postgres_endpoint() -> String {
    "some endpoint".to_string()
}

fn default_postgres_username() -> String {
    "some postgres username".to_string()
}

fn default_postgres_pw() -> String {
    "some postgres pw".to_string()
}

fn default_prfs_api_server_endpoint() -> String {
    "http://127.0.0.1:4000".to_string()
}
