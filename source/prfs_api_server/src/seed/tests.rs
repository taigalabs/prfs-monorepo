use prfs_db_driver::database2::Database2;
use std::{process::Command, sync::Arc};
use tokio::sync::OnceCell;

use super::upload::{upload_prfs_circuits, upload_prfs_proof_types};
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
    async fn seed_prfs_circuits() {
        prepare().await;
        let db = get_db().await;

        upload_prfs_circuits(&db).await;
    }

    #[tokio::test]
    async fn seed_prfs_proof_types() {
        prepare().await;
        let db = get_db().await;

        upload_prfs_proof_types(&db).await;
    }
}

mod seed_api2 {
    use crate::seed::upload::upload_prfs_atst_groups;

    use super::*;

    #[tokio::test]
    async fn seed_prfs_atst_group() {
        prepare().await;
        let db = get_db().await;

        upload_prfs_atst_groups(&db).await;
    }
}

mod seed_api3 {
    use prfs_entities::{
        PrfsAtstGroupMember, PrfsAtstGroupMemberCodeType, PrfsAtstGroupMemberStatus,
    };

    use super::*;
    use crate::seed::{
        csv::GroupMemberRecord,
        upload::{upload_prfs_atst_group_members, upload_prfs_atst_groups},
    };

    #[tokio::test]
    async fn seed_prfs_atst_group_members() {
        prepare().await;
        let db = get_db().await;

        let csv_path = PATHS.data_seed.join("csv/nonce_20240403.csv");
        let mut rdr = csv::Reader::from_path(csv_path).unwrap();

        let mut atst_group_members = vec![];
        for result in rdr.deserialize() {
            let record: GroupMemberRecord = result.unwrap();
            // println!("{:?}", record);

            let m = PrfsAtstGroupMember {
                atst_group_id: "0x1D73A70".to_string(),
                member_id: record.member_id,
                member_code: record.member_code,
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

        let csv_path = PATHS.data_seed.join("csv/nonce_20240403.csv");
        let mut rdr = csv::Reader::from_path(csv_path).unwrap();

        let mut atst_group_members = vec![];
        for result in rdr.deserialize() {
            let record: GroupMemberRecord = result.unwrap();
            // println!("{:?}", record);

            let m = PrfsAtstGroupMember {
                atst_group_id: "0x1D73A70".to_string(),
                member_id: record.member_id,
                member_code: record.member_code,
                code_type: PrfsAtstGroupMemberCodeType::Equality,
                status: PrfsAtstGroupMemberStatus::NotRegistered,
            };
            atst_group_members.push(m);
        }

        upload_prfs_atst_group_members(&db, &atst_group_members).await;
    }
}
