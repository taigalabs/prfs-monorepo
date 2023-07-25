use colored::Colorize;
use lazy_static::lazy_static;
use serde::Deserialize;

lazy_static! {
    pub static ref ENVS: Envs = Envs::new();
}

#[derive(Deserialize, Debug)]
pub struct Envs {
    pub geth_endpoint: String,
    pub postgres_endpoint: String,
    pub postgres_pw: String,
    pub scan_update_on_conflict: bool,
    pub scan_interval: usize,
    pub scan_balance_bucket_capacity: usize,
    pub start_block: usize,
    pub end_block: usize,
    pub set_json_path: String,
    pub set_offset: usize,
    pub set_query_limit: usize,
    pub set_insert_interval: usize,
}

impl Envs {
    pub fn new() -> Envs {
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
