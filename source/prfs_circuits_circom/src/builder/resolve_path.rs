use prfs_entities::entities::PrfsCircuit;

use crate::{paths::PATHS, FileKind};

pub(crate) fn get_path_segment(circuit: &PrfsCircuit, file_kind: FileKind) -> String {
    match file_kind {
        FileKind::R1CS => {
            let instance_path = &circuit.build_properties.get("instance_path").unwrap();
            let circuit_src_path = PATHS.circuits.join(&instance_path);
            let file_stem = circuit_src_path
                .file_stem()
                .unwrap()
                .to_os_string()
                .into_string()
                .unwrap();

            format!("{}/{}.r1cs", &circuit.circuit_type_id, file_stem,)
        }
        FileKind::Spartan => {
            format!(
                "{}/{}_{}.spartan.circuit",
                circuit.circuit_type_id, circuit.circuit_type_id, circuit.circuit_id,
            )
        }
        FileKind::WtnsGen => {
            format!(
                "{}/{}_js/{}_{}.wasm",
                circuit.circuit_type_id,
                circuit.circuit_type_id,
                circuit.circuit_type_id,
                circuit.circuit_id,
            )
        }
    }
}
