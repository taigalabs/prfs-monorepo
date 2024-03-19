use colored::Colorize;
use lazy_static::lazy_static;
use serde::Deserialize;

use crate::paths::PATHS;

lazy_static! {
    pub static ref ENVS: Envs = Envs::new();
}

#[derive(Deserialize, Debug)]
pub struct Envs {
    #[serde(default = "default_geth_endpoint")]
    pub geth_endpoint: String,

    #[serde(default = "default_postgres_endpoint")]
    pub postgres_endpoint: String,

    #[serde(default = "default_postgres_username")]
    pub postgres_username: String,

    #[serde(default = "default_postgres_pw")]
    pub postgres_pw: String,

    #[serde(default = "default_scan_json_path")]
    pub scan_json_path: String,

    #[serde(default = "default_scan_update_on_conflict")]
    pub scan_update_on_conflict: bool,

    #[serde(default = "default_scan_interval")]
    pub scan_interval: u64,

    #[serde(default = "default_scan_balance_bucket_capacity")]
    pub scan_balance_bucket_capacity: usize,

    #[serde(default = "default_scan_start_block")]
    pub scan_start_block: u64,

    #[serde(default = "default_scan_end_block")]
    pub scan_end_block: u64,

    #[serde(default = "default_set_json_path")]
    pub set_json_path: String,

    #[serde(default = "default_set_offset")]
    pub set_offset: usize,

    #[serde(default = "default_set_query_limit")]
    pub set_query_limit: usize,

    #[serde(default = "default_set_insert_interval")]
    pub set_insert_interval: u64,
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

fn default_geth_endpoint() -> String {
    String::from("some endpoint")
}

fn default_set_offset() -> usize {
    5000
}

fn default_postgres_endpoint() -> String {
    String::from("some endpoint")
}

fn default_postgres_username() -> String {
    String::from("some username")
}

fn default_postgres_pw() -> String {
    String::from("some pw")
}

fn default_scan_interval() -> u64 {
    3000
}

fn default_scan_json_path() -> String {
    String::from("scan/some_file.json")
}

fn default_set_json_path() -> String {
    String::from("scan/some_file.json")
}

fn default_scan_end_block() -> u64 {
    0
}

fn default_set_query_limit() -> usize {
    10000
}

fn default_scan_start_block() -> u64 {
    0
}

fn default_scan_update_on_conflict() -> bool {
    true
}

fn default_set_insert_interval() -> u64 {
    3000
}

fn default_scan_balance_bucket_capacity() -> usize {
    5000
}
