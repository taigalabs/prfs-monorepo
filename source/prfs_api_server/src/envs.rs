use colored::Colorize;
use dotenv::dotenv;
use lazy_static::lazy_static;
use serde::Deserialize;

lazy_static! {
    pub static ref ENVS: Envs = Envs::new();
}

#[derive(Deserialize, Debug)]
pub struct Envs {
    pub postgres_endpoint: String,
    pub postgres_pw: String,
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

    pub fn check(&self) {}
}
