use std::path::Path;

use aws_config::meta::region::RegionProviderChain;
use aws_sdk_s3::{
    error::SdkError,
    operation::put_object::{PutObjectError, PutObjectOutput},
    primitives::ByteStream,
    Client,
};
use colored::Colorize;
use dotenvy::dotenv;
use prfs_asset_server::{envs::ENVS, local};

const PRFS_BUCKET: &str = "prfs-asset-1";

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

async fn upload_object(
    client: &Client,
    bucket_name: &str,
    file_name: &str,
    key: &str,
) -> Result<PutObjectOutput, SdkError<PutObjectError>> {
    let body = ByteStream::from_path(Path::new(file_name)).await;
    client
        .put_object()
        .bucket(bucket_name)
        .key(key)
        .body(body.unwrap())
        .send()
        .await
}
