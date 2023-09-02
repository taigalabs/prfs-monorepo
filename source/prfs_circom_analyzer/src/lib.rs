use byteorder::{LittleEndian, ReadBytesExt};
use circuit_reader::{load_r1cs_from_bin_file, R1CS};
use ff::PrimeField;
use group::Group;
use itertools::Itertools;
use secq256k1::AffinePoint;
use secq256k1::FieldBytes;
use std::fs::OpenOptions;
use std::path::Path;
use std::{
    collections::HashMap,
    io::{BufReader, Error, ErrorKind, Read, Result, Seek, SeekFrom},
};

pub fn analyze(filename: &Path) {
    let (r1cs, wire_mapping) = load_r1cs_from_bin_file::<AffinePoint>(filename);

    for cs in r1cs.constraints {
        println!("cs: {:?}", cs);
    }
}
