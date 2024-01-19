use colored::Colorize;
use dotenvy::dotenv;
use lazy_static::lazy_static;
use serde::Deserialize;

lazy_static! {
    pub static ref ENVS: Envs = Envs::new();
}

#[derive(Deserialize, Debug)]
pub struct Envs {
    pub infura_api_key: String,
}

impl Envs {
    pub fn new() -> Envs {
        dotenv().unwrap();

        match envy::from_env::<Envs>() {
            Ok(envs) => {
                println!("{} dot env {:#?}", "Loaded".green(), envs);

                return envs;
            }
            Err(error) => panic!("Dot env is invalid, {:#?}", error),
        };
    }
}
