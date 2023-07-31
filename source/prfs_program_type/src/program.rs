use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub enum CircuitProgram {
    SpartanCircom2_1 {
        r#type: String,
        wtns_gen_url: String,
        circuit_url: String,
    },
}
