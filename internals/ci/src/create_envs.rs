use std::collections::HashMap;
use std::process::Command;

use crate::paths::PATHS;

pub fn create_envs() -> HashMap<&'static str, String> {
    let git_hash_env = std::env::var("GIT_COMMIT_HASH");
    let git_hash = match git_hash_env {
        Ok(h) => h,
        Err(_) => {
            let out = Command::new("git")
                .args(["rev-parse", "HEAD"])
                .output()
                .expect("git should exist");

            let out = String::from_utf8(out.stdout).unwrap();
            out.strip_suffix("\r\n")
                .or(out.strip_suffix("\n"))
                .unwrap()
                .to_string()
        }
    };

    let project_root_env = std::env::var("PROJECT_ROOT");
    let project_root = match project_root_env {
        Ok(r) => r,
        Err(_) => PATHS.ws_root.to_str().unwrap().to_string(),
    };

    let envs = HashMap::from([
        ("GIT_COMMIT_HASH", git_hash),
        ("PROJECT_ROOT", project_root),
    ]);

    envs
}
