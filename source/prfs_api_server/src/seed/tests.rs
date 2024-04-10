use prfs_db_driver::database2::Database2;
use prfs_db_driver::sqlx::types::Json as JsonType;
use prfs_db_interface::prfs;
use prfs_entities::PlainDataAtstMeta;
use prfs_entities::PlainDataValue;
use prfs_entities::PrfsAtstGroupId;
use prfs_entities::PrfsAtstMeta;
use prfs_entities::PrfsProofType;
use prfs_entities::{
    PrfsAtstGroupMember, PrfsAtstGroupMemberCodeType, PrfsAtstGroupMemberStatus, PrfsSet,
};
use prfs_rust_utils::serde::read_json_file;
use std::process::Command;
use tokio::sync::OnceCell;

use super::upload::{upload_prfs_circuits, upload_prfs_proof_types};
use crate::seed::data::get_prfs_proof_types;
use crate::seed::{
    csv::GroupMemberRecord,
    upload::{upload_prfs_atst_group_members, upload_prfs_atst_groups},
};
use crate::{envs::ENVS, paths::PATHS};

static ONCE: OnceCell<u32> = OnceCell::const_new();
const NODE_PKG_MANAGER: &str = "pnpm";

async fn prepare() {
    ONCE.get_or_init(|| async {
        let status = Command::new(NODE_PKG_MANAGER)
            .current_dir(&PATHS.package_root)
            .args(["run", "create-bindings"])
            .status()
            .expect(&format!("{} command failed to start", NODE_PKG_MANAGER));

        assert!(status.success());

        return 1;
    })
    .await;
}

async fn get_db() -> Database2 {
    let db2 = {
        let pg_endpoint = &ENVS.postgres_endpoint;
        let pg_username = &ENVS.postgres_username;
        let pg_pw = &ENVS.postgres_pw;

        let db2 = Database2::connect(pg_endpoint, pg_username, pg_pw)
            .await
            .unwrap();
        db2
    };

    db2
}

mod seed_api1 {
    use super::*;

    #[tokio::test]
    async fn seed_prfs_circuits_1() {
        prepare().await;
        let db = get_db().await;

        upload_prfs_circuits(&db).await;
    }

    #[tokio::test]
    async fn seed_prfs_proof_types_1() {
        prepare().await;
        get_prfs_proof_types();
        // let db = get_db().await;

        // let json_path = PATHS.data_seed__json_bindings.join("prfs_proof_types.json");
        // let proof_types: Vec<PrfsProofType> = read_json_file(&json_path).unwrap();
        // println!("proof types: {:#?}", proof_types);

        // upload_prfs_proof_types(&db, &proof_types).await;
    }
}

mod seed_api2 {
    use super::*;

    #[tokio::test]
    async fn seed_prfs_atst_group_1() {
        prepare().await;
        let db = get_db().await;

        upload_prfs_atst_groups(&db).await;
    }
}

mod seed_api3 {
    use super::*;

    #[tokio::test]
    async fn seed_prfs_atst_group_members_1() {
        prepare().await;

        let db = get_db().await;

        let csv_path = PATHS.data_seed.join("csv/nonce_seoul_20240409.csv");
        let mut rdr = csv::Reader::from_path(csv_path).unwrap();

        let mut atst_group_members = vec![];
        for result in rdr.deserialize() {
            let record: GroupMemberRecord = result.unwrap();
            // println!("{:?}", record);

            let m = PrfsAtstGroupMember {
                atst_group_id: PrfsAtstGroupId::nonce_seoul_1,
                member_id: record.member_id,
                member_code: record.member_code,
                meta: JsonType::from(PrfsAtstMeta::plain_data(PlainDataAtstMeta {
                    values: vec![PlainDataValue {
                        value_raw: record.value_raw,
                        label: "".into(),
                        meta: None,
                    }],
                })),
                code_type: PrfsAtstGroupMemberCodeType::Equality,
                status: PrfsAtstGroupMemberStatus::NotRegistered,
            };
            atst_group_members.push(m);
        }

        upload_prfs_atst_group_members(&db, &atst_group_members).await;
    }

    #[tokio::test]
    async fn seed_prfs_sets() {
        prepare().await;

        let db = get_db().await;
        let pool = &db.pool;
        let mut tx = pool.begin().await.unwrap();

        let json_path = PATHS.data_seed__json_bindings.join("prfs_sets.json");
        let prfs_sets: Vec<PrfsSet> = read_json_file(&json_path).unwrap();

        for prfs_set in prfs_sets {
            let set_id = prfs::insert_prfs_set(&mut tx, &prfs_set).await.unwrap();
            println!("Inserted Prfs set, set_id: {}", set_id);
        }

        tx.commit().await.unwrap();
    }
}
