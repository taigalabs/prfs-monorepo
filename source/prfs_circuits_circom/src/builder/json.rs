use crate::paths::PATHS;
use chrono::Utc;
use colored::Colorize;
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, io::Write, process::Command};

pub enum FileKind {
    Source,
    R1CS,
    Spartan,
    WtnsGen,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct BuildJson {
    pub timestamp: String,
    pub circuit_builds: HashMap<String, CircuitBuildDetail>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct CircuitBuildDetail {
    pub name: String,
    pub author: String,
    pub instance_path: String,
    pub src_path: String,
    pub num_public_inputs: usize,
    pub wtns_gen_path: String,
    pub spartan_circuit_path: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct CircuitDetail {
    pub name: String,
    pub instance_path: String,
    pub author: String,
    pub num_public_inputs: usize,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct CircuitsJson {
    pub circuits: HashMap<String, CircuitDetail>,
}
