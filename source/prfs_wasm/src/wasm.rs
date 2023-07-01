use byteorder::{LittleEndian, ReadBytesExt};
use console_error_panic_hook;
use ff::PrimeField;
use libspartan::{Assignment, Instance, NIZKGens, NIZK};
use merlin::Transcript;
use poseidon::poseidon_k256::{hash, FieldElement};
use secq256k1::{affine::Group, field::BaseField};
use std::io::{Error, Read};
use wasm_bindgen::{prelude::*, Clamped};

pub type G1 = secq256k1::AffinePoint;
pub type F1 = <G1 as Group>::Scalar;

pub use wasm_bindgen_rayon::init_thread_pool;

#[wasm_bindgen]
pub fn init_panic_hook() {
    console_error_panic_hook::set_once();
}

//
use hsl::HSL;
use num_complex::Complex64;
use rand::Rng;
use rayon::prelude::*;

type RGBA = [u8; 4];

// struct Generator {
//     width: u32,
//     height: u32,
//     palette: Box<[RGBA]>,
// }

// impl Generator {
//     fn new(width: u32, height: u32, max_iterations: u32) -> Self {
//         let mut rng = rand::thread_rng();

//         Self {
//             width,
//             height,
//             palette: (0..max_iterations)
//                 .map(move |_| {
//                     let (r, g, b) = HSL {
//                         h: rng.gen_range(0.0..360.0),
//                         s: 0.5,
//                         l: 0.6,
//                     }
//                     .to_rgb();
//                     [r, g, b, 255]
//                 })
//                 .collect(),
//         }
//     }

//     #[allow(clippy::many_single_char_names)]
//     fn get_color(&self, x: u32, y: u32) -> &RGBA {
//         let c = Complex64::new(
//             (f64::from(x) - f64::from(self.width) / 2.0) * 4.0 / f64::from(self.width),
//             (f64::from(y) - f64::from(self.height) / 2.0) * 4.0 / f64::from(self.height),
//         );
//         let mut z = Complex64::new(0.0, 0.0);
//         let mut i = 0;
//         while z.norm_sqr() < 4.0 {
//             if i == self.palette.len() {
//                 return &self.palette[0];
//             }
//             z = z.powi(2) + c;
//             i += 1;
//         }
//         &self.palette[i]
//     }

//     fn iter_row_bytes(&self, y: u32) -> impl '_ + Iterator<Item = u8> {
//         (0..self.width)
//             .flat_map(move |x| self.get_color(x, y))
//             .copied()
//     }

//     // Multi-threaded implementation.
//     #[cfg(feature = "rayon")]
//     fn iter_bytes(&self) -> impl '_ + ParallelIterator<Item = u8> {
//         (0..self.height)
//             .into_par_iter()
//             .flat_map_iter(move |y| self.iter_row_bytes(y))
//     }

//     // Single-threaded implementation.
//     #[cfg(not(feature = "rayon"))]
//     fn iter_bytes(&self) -> impl '_ + Iterator<Item = u8> {
//         (0..self.height).flat_map(move |y| self.iter_row_bytes(y))
//     }
// }

#[wasm_bindgen]
pub fn bb() -> Result<Vec<u8>, JsValue> {
    return Ok(vec![111]);
    // return Err(JsValue::from_str("aaa"));
    // Clamped(
    //     Generator::new(width, height, max_iterations)
    //         .iter_bytes()
    //         .collect(),
    // )
}

#[wasm_bindgen]
pub fn prove(circuit: &[u8], vars: &[u8], public_inputs: &[u8]) -> Result<Vec<u8>, JsValue> {
    let witness = load_witness_from_bin_reader::<F1, _>(vars).unwrap();
    // println!("witness len: {}", witness.len());

    let witness_bytes = witness
        .iter()
        .map(|w| w.to_repr().into())
        .collect::<Vec<[u8; 32]>>();

    let assignment = Assignment::new(&witness_bytes).unwrap();
    let circuit: Instance = bincode::deserialize(&circuit).unwrap();

    let num_cons = circuit.inst.get_num_cons();
    let num_vars = circuit.inst.get_num_vars();
    let num_inputs = circuit.inst.get_num_inputs();

    // println!(
    //     "#cons: {}, #vars: {}, #inputs: {}",
    //     num_cons, num_vars, num_inputs,
    // );

    // produce public parameters
    let gens = NIZKGens::new(num_cons, num_vars, num_inputs);

    let mut input = Vec::new();
    for i in 0..num_inputs {
        input.push(public_inputs[(i * 32)..((i + 1) * 32)].try_into().unwrap());
    }
    // println!("input len: {}", input.len());

    let input = Assignment::new(&input).unwrap();

    let mut prover_transcript = Transcript::new(b"nizk_example");

    // produce a proof of satisfiability
    let proof = NIZK::prove(
        &circuit,
        assignment.clone(),
        &input,
        &gens,
        &mut prover_transcript,
    );

    Ok(bincode::serialize(&proof).unwrap())
}

#[wasm_bindgen]
pub fn verify(circuit: &[u8], proof: &[u8], public_input: &[u8]) -> Result<bool, JsValue> {
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

#[wasm_bindgen]
pub fn poseidon(input_bytes: &[u8]) -> Result<Vec<u8>, JsValue> {
    let mut input = Vec::new();
    for i in 0..(input_bytes.len() / 32) {
        let f: [u8; 32] = input_bytes[(i * 32)..(i + 1) * 32].try_into().unwrap();
        let val = FieldElement::from_bytes(&f).unwrap();
        input.push(FieldElement::from(val));
    }

    let result = hash(input);

    Ok(result.to_bytes().to_vec())
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

#[cfg(test)]
mod test {
    use super::*;
    use std::{env::current_dir, fs};

    #[test]
    fn check_nizk() {
        println!("check_nizk()");

        let root = current_dir().unwrap();
        let circuit = fs::read(root.join("test_circuit/test_circuit.circuit")).unwrap();
        let vars = fs::read(root.join("test_circuit/witness.wtns")).unwrap();
        // println!("vars: {:?}", vars);

        let public_inputs = [F1::from(1u64), F1::from(1u64), F1::from(1u64)]
            .iter()
            .map(|w| w.to_repr())
            .flatten()
            .collect::<Vec<u8>>();

        println!("\npublic_inputs: {:?}", public_inputs);

        let proof = prove(
            circuit.as_slice(),
            vars.as_slice(),
            public_inputs.as_slice(),
        )
        .unwrap();

        println!("\nproof: {:?}", proof);

        let result = verify(
            circuit.as_slice(),
            proof.as_slice(),
            public_inputs.as_slice(),
        );

        println!("\nresult: {:?}", result);

        assert!(result.unwrap());
    }

    #[test]
    fn test_poseidon() {
        // Using the same inputs as poseidon.test.ts
        let a = FieldElement::from_str_vartime(
            "115792089237316195423570985008687907853269984665640564039457584007908834671663",
        )
        .unwrap()
        .to_bytes();
        let b = FieldElement::from_str_vartime(
            "115792089237316195423570985008687907853269984665640564039457584007908834671662",
        )
        .unwrap()
        .to_bytes();

        let mut inputs = [0u8; 64];
        inputs[..32].copy_from_slice(&a);
        inputs[32..].copy_from_slice(&b);
        // let result = poseidon(&inputs).unwrap();

        // assert_eq!(
        //     result.as_slice(),
        //     &[
        //         181, 226, 121, 200, 61, 3, 57, 70, 184, 30, 115, 145, 192, 7, 138, 73, 36, 8, 40,
        //         132, 190, 141, 35, 89, 108, 149, 235, 51, 129, 165, 64, 103
        //     ]
        // )
    }
}
