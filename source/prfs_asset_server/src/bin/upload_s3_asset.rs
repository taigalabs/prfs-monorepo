use aws_config::meta::region::RegionProviderChain;
use aws_sdk_s3::Client;
use colored::Colorize;
use dotenvy::dotenv;
use prfs_asset_server::envs::ENVS;

#[tokio::main]
async fn main() -> Result<(), aws_sdk_s3::Error> {
    println!(
        "{} pkg: {}, curr_dir: {:?}",
        "Starting".green(),
        env!("CARGO_PKG_NAME"),
        std::env::current_dir(),
    );

    dotenv().unwrap();

    let region_provider = RegionProviderChain::default_provider().or_else("us-east-1");
    let config = aws_config::from_env().region(region_provider).load().await;
    let client = Client::new(&config);

    let resp = client.list_buckets().send().await?;
    let buckets = resp.buckets().unwrap_or_default();
    let num_buckets = buckets.len();

    for bucket in buckets {
        println!("{}", bucket.name().unwrap_or_default());
    }

    println!("Found {} buckets.", num_buckets);

    Ok(())
}
