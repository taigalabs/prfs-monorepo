use crate::{geth::GethClient, paths::Paths, TreeMakerError};
use prfs_db_interface::database::Database;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct SubsetJson {
    set_id: String,
    where_clause: String,
}

pub async fn run(paths: &Paths) -> Result<(), TreeMakerError> {
    let pg_endpoint = std::env::var("POSTGRES_ENDPOINT")?;
    let pg_pw = std::env::var("POSTGRES_PW")?;
    let db = Database::connect(pg_endpoint, pg_pw).await?;

    let subset_filename = std::env::var("SUBSET_FILENAME")?;

    read_subset_file(paths, subset_filename)?;

    println!("run");

    Ok(())
}

fn read_subset_file(paths: &Paths, subset_filename: String) -> Result<(), TreeMakerError> {
    println!("subset_filename: {}", subset_filename);

    let subset_json_path = paths.subsets.join(subset_filename);

    let subset_json_bytes = std::fs::read(&subset_json_path).expect(&format!(
        "Subset should exist, path: {:?}",
        subset_json_path,
    ));

    let subset_json: SubsetJson = serde_json::from_slice(&subset_json_bytes).unwrap();
    println!("subset_json: {:?}", subset_json);

    // paths.subsets;
    //
    Ok(())
}
