use super::do_update_prfs_tree_by_new_atst_task;

#[cfg(test)]
mod tests {
    use super::*;
    use prfs_common_server_state::{init_server_state_test, ServerState};
    use prfs_entities::PrfsAtstGroupId;
    use std::sync::Arc;

    #[tokio::test]
    async fn test_do_update_prfs_tree_by_new_atst_task() {
        let server_state = Arc::new(init_server_state_test().await.unwrap());
        let atst_group_ids = vec![&PrfsAtstGroupId::crypto_1];

        do_update_prfs_tree_by_new_atst_task(&server_state, &atst_type_ids)
            .await
            .unwrap();
    }
}
