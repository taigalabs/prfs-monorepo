use std::path::PathBuf;

use crate::{serde::read_file_to_str, RustUtilsError};

pub fn read_md_file(path: &PathBuf) -> Result<String, RustUtilsError> {
    let md = read_file_to_str(path)?;

    return markdown::to_html_with_options(&md, &markdown::Options::gfm())
        .map_err(|err| format!("Couldn't parse markdown, err: {}", err).into());
}
