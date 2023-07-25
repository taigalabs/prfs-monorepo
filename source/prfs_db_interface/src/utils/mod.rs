pub fn concat_values() {}

pub fn concat_cols(cols: &[&str]) -> String {
    let cols = cols
        .iter()
        .map(|c| format!("\"{}\"", c))
        .collect::<Vec<String>>()
        .join(",");

    cols
}
