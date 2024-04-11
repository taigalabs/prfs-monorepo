use prfs_db_driver::sqlx::types::Json as JsonType;
use prfs_rust_utils::markdown::read_md_file;
use shy_entities::entities::{Locale, ShyChannel};

use crate::paths::PATHS;

pub fn get_shy_channels_seed() -> Vec<ShyChannel> {
    let crypto_holders_desc =
        read_md_file(&PATHS.data_seed.join("shy_channels/crypto_holders.md")).unwrap();

    let korean_crypto_holders_desc = read_md_file(
        &PATHS
            .data_seed
            .join("shy_channels/korean_crypto_holders.md"),
    )
    .unwrap();

    let channels = vec![
        ShyChannel {
            channel_id: "0xfea6ada".into(),
            label: "Korean crypto holders (한국 크립토 소유자)".into(),
            locale: Locale::ko,
            desc: korean_crypto_holders_desc,
            proof_type_ids: JsonType::from(vec![]),
            status: shy_entities::entities::ShyChannelStatus::Normal,
        },
        ShyChannel {
            channel_id: "0xb4f1fbe".into(),
            label: "Crypto holders".into(),
            locale: Locale::en,
            desc: crypto_holders_desc.into(),
            proof_type_ids: JsonType::from(vec![]),
            status: shy_entities::entities::ShyChannelStatus::Normal,
        },
        ShyChannel {
            channel_id: "0xa8482bb".into(),
            label: "Nonce community Seoul (논스)".into(),
            locale: Locale::ko,
            desc: "Crypto talk. Gossip in the industry. Thoughts on investment. Confessions. \
Whatever you couldn't have said with your identity revealed. You are expected to speak in English \
in this channel."
                .into(),
            proof_type_ids: JsonType::from(vec![]),
            status: shy_entities::entities::ShyChannelStatus::Normal,
        },
    ];

    return channels;
}
