use chrono::{DateTime, Utc};
use prfs_circuit_interface::circuit_types::{
    CircuitTypeData, CircuitTypeId, MerkleSigPosRangeV1Data, RangeData, RangeOption,
    SimpleHashV1Data,
};
use prfs_circuits_circom::CircuitBuildJson;
use prfs_db_driver::sqlx::types::Json as JsonType;
use prfs_entities::PrfsProofType;
use std::str::FromStr;

const SIMPLE_HASH_1: &str = "SIMPLE_HASH_1";
const CRYPTO_ASSET_SIZE_V1: &str = "CRYPTO_ASSET_SIZE_V1";
const NONCE_SEOUL_1: &str = "NONCE_SEOUL_1";

const SIMPLE_HASH_1_DESC: &str = include_str!("../../../data_seed/proof_types/SIMPLE_HASH_1.md");
const CRYPTO_ASSET_SIZE_V1_DESC: &str =
    include_str!("../../../data_seed/proof_types/CRYPTO_ASSET_SIZE_V1.md");

const CIRCUITS_BUILD_JSON: &str = include_str!("../../../../prfs_circuits_circom/build/build.json");

pub fn get_prfs_proof_types() -> Vec<PrfsProofType> {
    let circuit_build_json: CircuitBuildJson = serde_json::from_str(CIRCUITS_BUILD_JSON).unwrap();

    let prfs_proof_types = vec![
        PrfsProofType {
            proof_type_id: SIMPLE_HASH_1.into(),
            label: "Simple hash".into(),
            author: "Prfs".into(),
            desc: SIMPLE_HASH_1_DESC.into(),
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
            proof_type_id: CRYPTO_ASSET_SIZE_V1.into(),
            label: "Cryto asset size claim".into(),
            author: "Prfs".into(),
            desc: CRYPTO_ASSET_SIZE_V1_DESC.into(),
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
    ];

    println!("p: {:?}", prfs_proof_types);

    return prfs_proof_types;
}
