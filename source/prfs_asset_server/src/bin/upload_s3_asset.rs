use aws_config::meta::region::RegionProviderChain;
use aws_sdk_s3::{
    error::SdkError,
    operation::put_object::{PutObjectError, PutObjectOutput},
    primitives::ByteStream,
    Client,
};
use colored::Colorize;
use dotenvy::dotenv;
use prfs_asset_server::{envs::ENVS, local, paths::PATHS};
use walkdir::WalkDir;

const PRFS_BUCKET: &str = "prfs-asset-2";

#[tokio::main]
async fn main() -> Result<(), aws_sdk_s3::Error> {
    println!(
        "{} pkg: {}, curr_dir: {:?}",
        "Starting".green(),
        env!("CARGO_PKG_NAME"),
        std::env::current_dir(),
    );

    dotenv().unwrap();

    local::setup_local_assets();

    let region_provider = RegionProviderChain::default_provider().or_else("us-east-1");
    let config = aws_config::from_env().region(region_provider).load().await;
    let client = Client::new(&config);

    load_buckets(&client).await?;
    put_objects(&client).await?;

    Ok(())
}

async fn load_buckets(client: &Client) -> Result<(), aws_sdk_s3::Error> {
    let resp = client.list_buckets().send().await?;
    let buckets = resp.buckets().unwrap_or_default();

    for bucket in buckets {
        println!(
            "Found a S3 bucket, name: {}",
            bucket.name().unwrap_or_default()
        );
    }

    Ok(())
}

async fn put_objects(client: &Client) -> Result<(), aws_sdk_s3::Error> {
    let circuits_path = &PATHS.assets_circuits;

    // let list_json_path = circuits_path.join("list.json");
    // upload_object(&client, PRFS_BUCKET, list_json_path, "list.json").await?;

    for entry in WalkDir::new(circuits_path) {
        let entry = entry.unwrap();

        let file_path = entry.path();

        if !file_path.is_dir() {
            let key = file_path.strip_prefix(&PATHS.__).unwrap().to_str().unwrap();
            println!("file_path: {:?}, key: {:?}", file_path, key);

            upload_object(client, PRFS_BUCKET, file_path, key).await?;
        }
    }

    Ok(())
}

async fn upload_object(
    client: &Client,
    bucket_name: &str,
    file_path: impl AsRef<std::path::Path>,
    key: &str,
) -> Result<PutObjectOutput, SdkError<PutObjectError>> {
    let body = ByteStream::from_path(file_path).await;
    client
        .put_object()
        .bucket(bucket_name)
        .key(key)
        .body(body.unwrap())
        .send()
        .await
}
