pub fn concat_values(vals: &[&str]) -> String {
    let vals = vals
        .iter()
        .map(|c| format!("\'{}\'", c))
        .collect::<Vec<String>>()
        .join(",");

    vals
}

pub fn concat_cols(cols: &[&str]) -> String {
    let cols = cols
        .iter()
        .map(|c| format!("\"{}\"", c))
        .collect::<Vec<String>>()
        .join(",");

    cols
}
