use colored::Colorize;
use dotenvy;
use lazy_static::lazy_static;
use serde::Deserialize;
use std::path::PathBuf;

lazy_static! {
    pub static ref ENVS: Envs = Envs::new();
}

#[derive(Deserialize, Debug)]
pub struct Envs {
    pub infura_api_key: String,
}

impl Envs {
    pub fn new() -> Envs {
        let manifest_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
        let dotenv_path = manifest_dir.join(".env");
        println!("Prfs web fetcher dotenv_path: {:?}", manifest_dir);

        dotenvy::from_path(dotenv_path).unwrap();

        match envy::from_env::<Envs>() {
            Ok(envs) => {
                println!("{} dot env {:#?}", "Loaded".green(), envs);

                return envs;
            }
            Err(error) => panic!("Dot env is invalid, {:#?}", error),
        };
    }
}
