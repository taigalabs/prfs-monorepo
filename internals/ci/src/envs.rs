use std::collections::HashMap;

use crate::paths::PATHS;

pub fn get_envs() -> HashMap<&'static str, &'static str> {
    let envs = HashMap::from([
        ("GIT_COMMIT_HASH", "AAA"),
        ("PRFS_WORKSPACE_ROOT", PATHS.ws_root.to_str().unwrap()),
    ]);

    envs
}
