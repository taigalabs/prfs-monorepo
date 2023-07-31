use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub enum CircuitProgram {
    SpartanCircom2_1 {
        r#type: String,
        wtns_gen_url: String,
        circuit_url: String,
    },
}

impl std::fmt::Display for CircuitProgram {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let str = serde_json::to_string(&self).unwrap();
        f.write_str(&str)
    }
}
