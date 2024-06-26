use colored::Colorize;
use std::{fs::File, sync::OnceLock};

use crate::paths::PATHS;

static ONCE: OnceLock<u32> = OnceLock::new();

const MASTER_ACCOUNT_IDS: [&str; 5] = [
    "0xda6870ea13b66dd273c084e0fba28a68de597986",
    "0x685efed130de6dc7aeae3a7a4e317ebd092991a5",
    "0x8c8f8bd6efa9a6ec31ab4d4fdc9f472a85ef5244",
    "0xdeeabb303fa86dcadb1fd6591933be7c667671f5",
    "0x1f1c81eecf1ccec0366a77252327feb24f082dd8",
];

#[inline]
pub fn get_master_account_ids() -> [&'static str; 5] {
    let file_name = "master_account_ids.json";

    ONCE.get_or_init(|| {
        let file_path = PATHS.json_bindings.join(file_name);
        let mut file = File::create(file_path).unwrap();

        // MASTER_ACCOUNT_IDS
        serde_json::to_writer_pretty(&mut file, &MASTER_ACCOUNT_IDS).unwrap();
        println!("{} {}", "Created".green(), file_name);

        return 0;
    });

    return MASTER_ACCOUNT_IDS;
}
