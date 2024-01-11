use colored::Colorize;
use serde::de::DeserializeOwned;
use shy_api_server::paths::PATHS;
use std::{collections::HashMap, path::PathBuf};

use prfs_entities::shy_api_entities::ShyChannel;

const SHY_CHANNELS_JSON: &str = "shy_channels.json";

pub fn load_shy_channels() -> HashMap<String, ShyChannel> {
    println!("\n{} circuit input types", "Loading".green());

    let json_path = PATHS.data_seed__json_bindings.join(SHY_CHANNELS_JSON);
    let shy_channels: Vec<ShyChannel> = read_json(&json_path);

    let mut m = HashMap::new();
    for ch in shy_channels {
        println!("Reading shy channel, channel_id: {}", ch.channel_id);

        m.insert(ch.channel_id.to_string(), ch);
    }

    return m;
}

fn read_json<T>(json_path: &PathBuf) -> T
where
    T: DeserializeOwned,
{
    let b = std::fs::read(&json_path).expect(&format!("file not exists, {:?}", json_path));
    let json: T = serde_json::from_slice(&b).unwrap();
    json
}
