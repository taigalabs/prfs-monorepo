use crate::{paths::PATHS, ProgramsJson};

pub fn load_system_native_program_types() -> ProgramsJson {
    let programs_json_path = PATHS.data.join("programs");
    let b = std::fs::read(&programs_json_path).unwrap();
    let programs_json: ProgramsJson = serde_json::from_slice(&b).unwrap();

    return programs_json;
}
