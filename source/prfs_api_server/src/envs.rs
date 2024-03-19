use colored::Colorize;
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

    #[serde(default = "default_prfs_api_private_key")]
    pub prfs_api_private_key: String,

    pub infura_api_key: String,
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

fn default_prfs_api_private_key() -> String {
    "63e64e77016fd8a1adeb1a88b77171517b1c2acfa8f7885d581252ce031db47c".to_string()
}
