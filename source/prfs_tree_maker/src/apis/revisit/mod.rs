use crate::{
    envs::ENVS,
    geth::{GetBalanceRequest, GethClient},
};
use clap::ArgMatches;
use prfs_db_interface::{database::Database, models::EthAccount};
use rust_decimal::Decimal;

pub async fn revisit(_sub_matches: &ArgMatches) {
    let geth_endpoint: String = ENVS.geth_endpoint.to_string();
    let geth_client = GethClient::new(geth_endpoint);

    let pg_endpoint = &ENVS.postgres_endpoint;
    let pg_pw = &ENVS.postgres_pw;
    let db = Database::connect(pg_endpoint, pg_pw).await.unwrap();

    run(&db, &geth_client).await;
}

async fn run(db: &Database, geth: &GethClient) {
    let accs = db
        .get_eth_accounts("where acc.addr = '0xe94f1fa4f27d9d288ffea234bb62e1fbc086ca0c'")
        .await
        .unwrap();

    println!("accs: {:#?}", accs);

    for acc in accs {
        let addr = &acc.addr;
        let resp = geth
            .eth_getBalance(GetBalanceRequest(&acc.addr, "latest"))
            .await
            .unwrap();

        if let Some(r) = resp.result {
            let wei_str = r.strip_prefix("0x").expect("wei should contain 0x");
            let wei = Decimal::from_str_radix(wei_str, 16).unwrap();

            println!("wei: {}, old_wei: {}", wei, acc.wei);

            // let acc = EthAccount {
            //     addr: acc.addr.to_string(),
            //     wei,
            // };

            // balances.insert(addr, acc);

            // if idx % 200 == 0 {
            //     let rows_updated = db.insert_eth_accounts(balances, false).await.unwrap();
            //     println!("idx: {}, rows_updated: {}", idx, rows_updated);

            //     balances = BTreeMap::new();
            // }
        }
        // acc.wei;
        //
    }

    // println!("accs len: {}", accs.len());
}
