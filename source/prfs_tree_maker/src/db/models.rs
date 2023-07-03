use rust_decimal::Decimal;

#[derive(Debug)]
pub struct Account {
    pub addr: String,
    pub wei: Decimal,
}

#[derive(Debug)]
pub struct Node {
    pub pos: String,
    pub val: String,
    pub set_id: String,
}
