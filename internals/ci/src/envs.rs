use std::collections::HashMap;
use std::process::Command;

use crate::paths::PATHS;

pub fn get_envs() -> HashMap<&'static str, String> {
    let git_hash = {
        let out = Command::new("git")
            .args(["rev-parse", "HEAD"])
            .output()
            .expect("git should exist");

        String::from_utf8(out.stdout).unwrap()
    };

    let envs = HashMap::from([
        ("GIT_COMMIT_HASH", git_hash),
        ("PROJECT_ROOT", PATHS.ws_root.to_str().unwrap().to_string()),
    ]);

    envs
}
