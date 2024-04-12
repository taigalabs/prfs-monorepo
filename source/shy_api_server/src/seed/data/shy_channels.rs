use prfs_db_driver::sqlx::types::Json as JsonType;
use prfs_rust_utils::markdown::read_md_file;
use shy_entities::{Locale, ShyChannel, ShyChannelStatus, ShyChannelType};

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
    let nonce_seoul_md =
        read_md_file(&PATHS.data_seed.join("shy_channels/nonce_seoul.md")).unwrap();

    let channels = vec![
        ShyChannel {
            channel_id: "0xfea6ada".into(),
            label: "Korean crypto holders (한국 크립토 소유자)".into(),
            locale: Locale::ko,
            desc: korean_crypto_holders_desc,
            proof_type_ids: JsonType::from(vec![]),
            status: ShyChannelStatus::Normal,
            r#type: ShyChannelType::Open,
        },
        ShyChannel {
            channel_id: "0xb4f1fbe".into(),
            label: "Crypto holders".into(),
            locale: Locale::en,
            desc: crypto_holders_desc.into(),
            proof_type_ids: JsonType::from(vec![]),
            status: ShyChannelStatus::Normal,
            r#type: ShyChannelType::Open,
        },
        ShyChannel {
            channel_id: "0xa8482bb".into(),
            label: "Nonce community Seoul (논스)".into(),
            locale: Locale::ko,
            desc: nonce_seoul_md,
            proof_type_ids: JsonType::from(vec![]),
            status: ShyChannelStatus::Normal,
            r#type: ShyChannelType::Closed,
        },
    ];

    return channels;
}
