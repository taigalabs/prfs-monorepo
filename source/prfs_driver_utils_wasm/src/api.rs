use crate::PrfsDriverSpartanWasmError;
use byteorder::{LittleEndian, ReadBytesExt};
use ff::PrimeField;
use libspartan::{Assignment, Instance, NIZKGens, NIZK};
use merlin::Transcript;
use prfs_crypto::{hash_from_bytes, MerkleProof};
use secq256k1::affine::Group;
use std::io::{Error, Read};
use wasm_bindgen::{prelude::*, Clamped};
use web_sys::console;

pub type G1 = secq256k1::AffinePoint;
pub type F1 = <G1 as Group>::Scalar;

pub fn verify(
    circuit: &[u8],
    proof: &[u8],
    public_input: &[u8],
) -> Result<bool, PrfsDriverSpartanWasmError> {
    let circuit: Instance = bincode::deserialize(&circuit).unwrap();
    let proof: NIZK = bincode::deserialize(&proof).unwrap();

    let num_cons = circuit.inst.get_num_cons();
    let num_vars = circuit.inst.get_num_vars();
    let num_inputs = circuit.inst.get_num_inputs();

    // produce public parameters
    let gens = NIZKGens::new(num_cons, num_vars, num_inputs);

    let mut inputs = Vec::new();
    for i in 0..num_inputs {
        inputs.push(public_input[(i * 32)..((i + 1) * 32)].try_into().unwrap());
    }

    let inputs = Assignment::new(&inputs).unwrap();

    let mut verifier_transcript = Transcript::new(b"nizk_example");

    let verified = proof
        .verify(&circuit, &inputs, &mut verifier_transcript, &gens)
        .is_ok();

    Ok(verified)
}

pub fn poseidon(input_bytes: &[u8]) -> Result<Vec<u8>, PrfsDriverSpartanWasmError> {
    match hash_from_bytes(input_bytes) {
        Ok(r) => Ok(r.to_vec()),
        Err(err) => {
            return Err(err.to_string().into());
        }
    }
}

pub fn get_build_status() -> Result<String, PrfsDriverSpartanWasmError> {
    return Ok(libspartan::get_build_status());
}

pub fn make_merkle_proof(
    leaves: Vec<String>,
    leaf_idx: u128,
    depth: u8,
) -> Result<MerkleProof, PrfsDriverSpartanWasmError> {
    match prfs_crypto::make_merkle_proof(leaves, leaf_idx, depth) {
        Ok(p) => return Ok(p),
        Err(err) => return Err(err.to_string().into()),
    };
}

// Copied from Nova Scotia
pub fn read_field<R: Read, Fr: PrimeField>(mut reader: R) -> Result<Fr, Error> {
    let mut repr = Fr::zero().to_repr();
    for digit in repr.as_mut().iter_mut() {
        // TODO: may need to reverse order?
        *digit = reader.read_u8()?;
    }
    let fr = Fr::from_repr(repr).unwrap();
    Ok(fr)
}

pub fn load_witness_from_bin_reader<Fr: PrimeField, R: Read>(
    mut reader: R,
) -> Result<Vec<Fr>, Error> {
    let mut wtns_header = [0u8; 4];
    reader.read_exact(&mut wtns_header)?;
    if wtns_header != [119, 116, 110, 115] {
        // ruby -e 'p "wtns".bytes' => [119, 116, 110, 115]
        panic!("invalid file header");
    }
    // println!("wtns_header: {:?}", wtns_header);

    let version = reader.read_u32::<LittleEndian>()?;
    // println!("wtns version {}", version);
    if version > 2 {
        panic!("unsupported file version");
    }
    // println!("version: {}", version);

    let num_sections = reader.read_u32::<LittleEndian>()?;
    if num_sections != 2 {
        panic!("invalid num sections");
    }
    // println!("num_sections: {:?}", num_sections);

    // read the first section
    let sec_type = reader.read_u32::<LittleEndian>()?;
    if sec_type != 1 {
        panic!("invalid section type");
    }
    // println!("sec_type: {:?}", sec_type);

    let sec_size = reader.read_u64::<LittleEndian>()?;
    if sec_size != 4 + 32 + 4 {
        panic!("invalid section len")
    }
    // println!("sec_size: {:?}", sec_size);

    let field_size = reader.read_u32::<LittleEndian>()?;
    if field_size != 32 {
        panic!("invalid field byte size");
    }
    // println!("field_size: {:?}", field_size);

    let mut prime = vec![0u8; field_size as usize];
    reader.read_exact(&mut prime)?;
    // println!("prime: {:?}", prime);

    // if prime != hex!("010000f093f5e1439170b97948e833285d588181b64550b829a031e1724e6430") {
    //     bail!("invalid curve prime {:?}", prime);
    // }

    let witness_len = reader.read_u32::<LittleEndian>()?;
    // println!("witness len {}", witness_len);

    let sec_type = reader.read_u32::<LittleEndian>()?;
    if sec_type != 2 {
        panic!("invalid section type");
    }
    // println!("sec_type: {:?}", sec_type);

    let sec_size = reader.read_u64::<LittleEndian>()?;
    if sec_size != (witness_len * field_size) as u64 {
        panic!("invalid witness section size {}", sec_size);
    }
    // println!("sec_size: {:?}", sec_size);

    let mut result = Vec::with_capacity(witness_len as usize);
    for idx in 0..witness_len {
        let wts = read_field::<&mut R, Fr>(&mut reader)?;
        // println!("witness ({}): {:?}", idx, wts);

        result.push(wts);
    }
    Ok(result)
}
