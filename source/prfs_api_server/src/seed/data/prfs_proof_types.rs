use chrono::{DateTime, Utc};
use prfs_circuit_interface::circuit_types::{
    CircuitTypeData, CircuitTypeId, MerkleSigPosExactV1Data, MerkleSigPosRangeV1Data, RangeData,
    RangeOption, SimpleHashV1Data,
};
use prfs_circuits_circom::CircuitBuildJson;
use prfs_db_driver::sqlx::types::Json as JsonType;
use prfs_entities::PrfsProofType;
use prfs_rust_utils::{markdown::read_md_file, serde::read_json_file};
use std::str::FromStr;

use crate::paths::PATHS;

pub fn load_prfs_proof_types() -> Vec<PrfsProofType> {
    let simple_hash_1_desc =
        read_md_file(&PATHS.data_seed.join("proof_types/SIMPLE_HASH_1.md")).unwrap();
    let crypto_asset_size_v1_desc =
        read_md_file(&PATHS.data_seed.join("proof_types/CRYPTO_ASSET_SIZE_V1.md")).unwrap();
    let nonce_seoul_1_desc =
        read_md_file(&PATHS.data_seed.join("proof_types/NONCE_SEOUL_1.md")).unwrap();

    let circuit_build_json: CircuitBuildJson =
        read_json_file(&prfs_circuits_circom::get_build_fs_path().join("build.json")).unwrap();

    let prfs_proof_types = vec![
        PrfsProofType {
            proof_type_id: "simple_hash_v1".into(),
            label: "Simple hash".into(),
            author: "Prfs".into(),
            desc: simple_hash_1_desc,
            expression: "Knows hash argument".into(),
            img_url: Some("https://d1w1533jipmvi2.cloudfront.net/hash.png".into()),
            img_caption: None,
            circuit_id: circuit_build_json.circuits[&CircuitTypeId::simple_hash_v1]
                .circuit_id
                .clone(),
            circuit_type_id: CircuitTypeId::simple_hash_v1,
            circuit_type_data: JsonType::from(CircuitTypeData::simple_hash_v1(SimpleHashV1Data {})),
            created_at: DateTime::<Utc>::from_str("2023-09-01T16:39:57-08:00").unwrap(),
            experimental: false,
        },
        PrfsProofType {
            proof_type_id: "crypto_asset_size_v1".into(),
            label: "Cryto asset size claim".into(),
            author: "Prfs".into(),
            desc: crypto_asset_size_v1_desc,
            expression: "Has assets in crypto worth X USD".into(),
            img_url: Some("https://d1w1533jipmvi2.cloudfront.net/money_cash_1.webp".into()),
            img_caption: None,
            circuit_id: circuit_build_json.circuits[&CircuitTypeId::merkle_sig_pos_range_v1]
                .circuit_id
                .clone(),
            circuit_type_id: CircuitTypeId::merkle_sig_pos_range_v1,
            circuit_type_data: JsonType::from(CircuitTypeData::merkle_sig_pos_range_v1(
                MerkleSigPosRangeV1Data {
                    prfs_set_id: "crypto_holders".into(),
                    range_data: RangeData {
                        label: "Asset size in USc (US cent)".into(),
                        options: vec![
                            RangeOption {
                                label: "$0-$10".into(),
                                lower_bound: 0,
                                upper_bound: 1000,
                            },
                            RangeOption {
                                label: "$10-$1K".into(),
                                lower_bound: 1000,
                                upper_bound: 100000,
                            },
                            RangeOption {
                                label: "$1K-$10K".into(),
                                lower_bound: 100000,
                                upper_bound: 1000000,
                            },
                            RangeOption {
                                label: "$10K-$100K".into(),
                                lower_bound: 1000000,
                                upper_bound: 10000000,
                            },
                            RangeOption {
                                label: "$100K-$1M".into(),
                                lower_bound: 10000000,
                                upper_bound: 100000000,
                            },
                            RangeOption {
                                label: "$1M-$10M".into(),
                                lower_bound: 100000000,
                                upper_bound: 1000000000,
                            },
                            RangeOption {
                                label: "$10M-$50M".into(),
                                lower_bound: 1000000000,
                                upper_bound: 5000000000,
                            },
                            RangeOption {
                                label: "$50M-$1B".into(),
                                lower_bound: 5000000000,
                                upper_bound: 10000000000,
                            },
                        ],
                    },
                },
            )),
            created_at: DateTime::from_str("2024-01-29T16:39:57-08:00").unwrap(),
            experimental: false,
        },
        PrfsProofType {
            proof_type_id: "nonce_seoul_v1".into(),
            label: "Nonce community Seoul".into(),
            author: "Prfs".into(),
            desc: nonce_seoul_1_desc,
            expression: "Is a member of the group with some value".into(),
            img_url: Some("https://d1w1533jipmvi2.cloudfront.net/nonce.jpeg".into()),
            img_caption: None,
            circuit_id: circuit_build_json.circuits[&CircuitTypeId::merkle_sig_pos_exact_v1]
                .circuit_id
                .clone(),
            circuit_type_id: CircuitTypeId::merkle_sig_pos_exact_v1,
            circuit_type_data: JsonType::from(CircuitTypeData::merkle_sig_pos_exact_v1(
                MerkleSigPosExactV1Data {
                    prfs_set_id: "nonce_seoul_1".into(),
                },
            )),
            created_at: DateTime::from_str("2024-01-29T16:39:57-08:00").unwrap(),
            experimental: false,
        },
    ];

    return prfs_proof_types;
}
