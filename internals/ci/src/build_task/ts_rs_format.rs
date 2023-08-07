use crate::deps::PRETTIERD;
use colored::Colorize;
use std::{io::Write, path::PathBuf, process::Stdio};

const TS_EXT: &str = "ts";

pub fn format_ts_files(dir_path: &PathBuf) {
    println!(
        "{} formatting ts files, dir: {:?}",
        "Start".green(),
        dir_path
    );

    let dir = std::fs::read_dir(dir_path).unwrap();

    for file in dir {
        let fd = file.unwrap();
        let file_path = fd.path();
        let ext = file_path.extension().unwrap();

        let content = std::fs::read(&file_path).unwrap();

        if ext == TS_EXT {
            println!("Formatting file: {:?}", fd.file_name());

            let mut child = std::process::Command::new(PRETTIERD)
                .arg(fd.file_name())
                .stdin(Stdio::piped())
                .stdout(Stdio::piped())
                .spawn()
                .unwrap();

            let stdin = child.stdin.as_mut().unwrap();
            stdin.write_all(&content).unwrap();

            let output = child.wait_with_output().unwrap();
            // let out = String::from_utf8(output.stdout).unwrap();
            // output.stdout;

            std::fs::write(file_path, &output.stdout).unwrap();
        }
    }
}
