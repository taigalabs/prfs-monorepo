import { PrfsCircuit } from "@taigalabs/prfs-entities/bindings/PrfsCircuit";
import {
  ADDR_MEMBERSHIP2_V1_CIRCUIT_ID,
  MERKLE_SIG_POS_RANGE_V1_CIRCUIT_ID,
  MERKLE_SIG_POS_RANGE_V1,
  SIMPLE_HASH_V1,
  SIMPLE_HASH_V1_CIRCUIT_ID,
  ADDR_MEMBERSHIP_V1,
} from "@taigalabs/prfs-circuit-interface";

const circuits: PrfsCircuit[] = [
  {
    circuit_id: ADDR_MEMBERSHIP2_V1_CIRCUIT_ID,
    circuit_type_id: ADDR_MEMBERSHIP_V1,
    created_at: "2023-05-01T16:39:57-08:00",
    label: "addr_membership2_1",
    author: "SYSTEM_NATIVE",
    num_public_inputs: 0,
    desc: "Prove address membership (ECDSA, Poseidon)",
    circuit_dsl: "Circom 2",
    arithmetization: "R1CS",
    proof_algorithm: "Spartan",
    elliptic_curve: "Secp256k1",
    finite_field: "Z_(2^256-2^32-977)",
    circuit_driver_id: "SPARTAN_CIRCOM_1",
    driver_version: "0.1.0",
    build_properties: {
      instance_path: `instances/${ADDR_MEMBERSHIP_V1}.circom`,
    },
    driver_properties: {
      wtns_gen_url: "",
      circuit_url: "",
    },
    raw_circuit_inputs_meta: [
      {
        label: "Tx",
        desc: "Tx description",
        type: "FIELD_ELEMENT",
        public: true,
      },
      {
        label: "Ty",
        desc: "Ty description",
        type: "FIELD_ELEMENT",
        public: true,
      },
      {
        label: "Ux",
        desc: "Ux description",
        type: "FIELD_ELEMENT",
        public: true,
      },
      {
        label: "Uy",
        desc: "Uy description",
        type: "FIELD_ELEMENT",
        public: true,
      },
      {
        label: "Merkle root",
        desc: "Vector commitment (Merkle root) of a set",
        type: "FIELD_ELEMENT",
        public: true,
      },
      {
        label: "Serial number",
        desc: "A cryptographic commitment made out of 's'",
        type: "FIELD_ELEMENT",
        public: true,
      },
      {
        label: "m",
        desc: "Message",
        type: "FIELD_ELEMENT",
      },
      {
        label: "r",
        desc: "R value of a signature",
        type: "FIELD_ELEMENT",
      },
      {
        label: "s",
        desc: "S value of a siganture",
        type: "FIELD_ELEMENT",
      },
      {
        label: "pathIndices",
        desc: "Merkle path indices",
        type: "FIELD_ELEMENT_VECTOR",
      },
      {
        label: "siblings",
        desc: "Siblings of a leaf in a Merkle path towards the root",
        type: "FIELD_ELEMENT_VECTOR",
      },
    ],
  },
  {
    circuit_id: SIMPLE_HASH_V1_CIRCUIT_ID,
    circuit_type_id: SIMPLE_HASH_V1,
    created_at: "2023-10-01T16:39:57-08:00",
    label: "simple_hash_1_1",
    author: "SYSTEM_NATIVE",
    num_public_inputs: 0,
    desc: "Simple Poseidon hash function",
    circuit_dsl: "Circom 2",
    arithmetization: "R1CS",
    proof_algorithm: "Spartan",
    elliptic_curve: "Secp256k1",
    finite_field: "Z_(2^256-2^32-977)",
    build_properties: {
      instance_path: `instances/${SIMPLE_HASH_V1}.circom`,
    },
    circuit_driver_id: "SPARTAN_CIRCOM_1",
    driver_version: "0.1.0",
    driver_properties: {
      wtns_gen_url: "",
      circuit_url: "",
    },
    raw_circuit_inputs_meta: [
      {
        label: "s",
        desc: "Hash argument",
        type: "FIELD_ELEMENT",
      },
      {
        label: "image",
        desc: "Hash result",
        type: "FIELD_ELEMENT",
        public: true,
      },
    ],
  },
  {
    circuit_id: MERKLE_SIG_POS_RANGE_V1_CIRCUIT_ID,
    circuit_type_id: MERKLE_SIG_POS_RANGE_V1,
    created_at: "2024-02-02T00:00:00-00:00",
    label: "Merkle pos range v1",
    author: "SYSTEM_NATIVE",
    num_public_inputs: 0,
    desc: "Merkle pos range v1",
    circuit_dsl: "Circom 2",
    arithmetization: "R1CS",
    proof_algorithm: "Spartan",
    elliptic_curve: "Secp256k1",
    finite_field: "Z_(2^256-2^32-977)",
    build_properties: {
      instance_path: `instances/${MERKLE_SIG_POS_RANGE_V1}.circom`,
    },
    circuit_driver_id: "SPARTAN_CIRCOM_1",
    driver_version: "0.1.0",
    driver_properties: {
      wtns_gen_url: "",
      circuit_url: "",
    },
    raw_circuit_inputs_meta: [
      {
        label: "leaf",
        desc: "Leaf of a tree",
        type: "FIELD_ELEMENT",
      },
      {
        label: "Merkle root",
        desc: "Vector commitment (Merkle root) of a set",
        type: "FIELD_ELEMENT",
        public: true,
      },
      {
        label: "pathIndices",
        desc: "Merkle path indices",
        type: "FIELD_ELEMENT_VECTOR",
      },
      {
        label: "siblings",
        desc: "Siblings of a leaf in a Merkle path towards the root",
        type: "FIELD_ELEMENT_VECTOR",
      },
      // {
      //   label: "Serial number",
      //   desc: "A cryptographic commitment made out of 's'",
      //   type: "FIELD_ELEMENT",
      //   public: true,
      // },
    ],
  },
];

export default circuits;
