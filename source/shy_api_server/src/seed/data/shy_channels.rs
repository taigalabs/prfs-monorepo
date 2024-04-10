use prfs_db_driver::sqlx::types::Json as JsonType;
use prfs_rust_utils::markdown::read_md_file;
use shy_entities::entities::ShyChannel;

use crate::paths::PATHS;

pub fn get_shy_channels_seed() -> Vec<ShyChannel> {
    let crypto_holders_desc =
        read_md_file(&PATHS.data_seed.join("shy_channels/crypto_holders.md")).unwrap();

    let channels = vec![
        ShyChannel {
            channel_id: "0xfea6ada".into(),
            label: "Korean crypto holders (한국 크립토 소유자)".into(),
            locale: "ko".into(),
            desc: "한국어로 가상화폐 및 크립토 산업에 대해 토론합니다".into(),
            proof_type_ids: JsonType::from(vec![]),
            status: shy_entities::entities::ShyChannelStatus::Normal,
        },
        ShyChannel {
            channel_id: "0xb4f1fbe".into(),
            label: "Crypto holders".into(),
            locale: "ko".into(),
            desc: crypto_holders_desc.into(),
            proof_type_ids: JsonType::from(vec![]),
            status: shy_entities::entities::ShyChannelStatus::Normal,
        },
        ShyChannel {
            channel_id: "0xa8482bb".into(),
            label: "Nonce community Seoul (논스)".into(),
            locale: "ko".into(),
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
