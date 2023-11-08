import { PrfsCircuit } from "@taigalabs/prfs-entities/bindings/PrfsCircuit";

const circuits: PrfsCircuit[] = [
  {
    circuit_id: "00000000-0000-0000-0000-000000000002",
    circuit_type_id: "MEMBERSHIP_PROOF_1",
    created_at: "2023-05-01T16:39:57-08:00",
    label: "addr_membership",
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
      instance_path: "instances/addr_membership.circom",
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
  // {
  //   circuit_id: "00000000-0000-0000-0000-000000000000",
  //   circuit_type_id: "MEMBERSHIP_PROOF_1",
  //   created_at: "2023-05-01T16:39:57-08:00",
  //   label: "addr_membership2_1",
  //   author: "SYSTEM_NATIVE",
  //   num_public_inputs: 0,
  //   desc: "Prove address membership (ECDSA, Poseidon)",
  //   circuit_dsl: "Circom 2",
  //   arithmetization: "R1CS",
  //   proof_algorithm: "Spartan",
  //   elliptic_curve: "Secp256k1",
  //   finite_field: "Z_(2^256-2^32-977)",
  //   circuit_driver_id: "SPARTAN_CIRCOM_1",
  //   driver_version: "0.1.0",
  //   build_properties: {
  //     instance_path: "instances/addr_membership2_1.circom",
  //   },
  //   driver_properties: {
  //     wtns_gen_url: "",
  //     circuit_url: "",
  //   },
  //   raw_circuit_inputs_meta: [
  //     {
  //       label: "Tx",
  //       desc: "Tx description",
  //       type: "FIELD_ELEMENT",
  //       public: true,
  //     },
  //     {
  //       label: "Ty",
  //       desc: "Ty description",
  //       type: "FIELD_ELEMENT",
  //       public: true,
  //     },
  //     {
  //       label: "Ux",
  //       desc: "Ux description",
  //       type: "FIELD_ELEMENT",
  //       public: true,
  //     },
  //     {
  //       label: "Uy",
  //       desc: "Uy description",
  //       type: "FIELD_ELEMENT",
  //       public: true,
  //     },
  //     {
  //       label: "Merkle root",
  //       desc: "Vector commitment (Merkle root) of a set",
  //       type: "FIELD_ELEMENT",
  //       public: true,
  //     },
  //     {
  //       label: "Serial number",
  //       desc: "A cryptographic commitment made out of 's'",
  //       type: "FIELD_ELEMENT",
  //       public: true,
  //     },
  //     {
  //       label: "m",
  //       desc: "Message",
  //       type: "FIELD_ELEMENT",
  //     },
  //     {
  //       label: "r",
  //       desc: "R value of a signature",
  //       type: "FIELD_ELEMENT",
  //     },
  //     {
  //       label: "s",
  //       desc: "S value of a siganture",
  //       type: "FIELD_ELEMENT",
  //     },
  //     {
  //       label: "pathIndices",
  //       desc: "Merkle path indices",
  //       type: "FIELD_ELEMENT_VECTOR",
  //     },
  //     {
  //       label: "siblings",
  //       desc: "Siblings of a leaf in a Merkle path towards the root",
  //       type: "FIELD_ELEMENT_VECTOR",
  //     },
  //   ],
  // },
  // {
  //   circuit_id: "00000000-0000-0000-0000-000000000001",
  //   circuit_type_id: "SIMPLE_HASH_1",
  //   created_at: "2023-10-01T16:39:57-08:00",
  //   label: "simple_hash_1_1",
  //   author: "SYSTEM_NATIVE",
  //   num_public_inputs: 0,
  //   desc: "Simple Poseidon hash function",
  //   circuit_dsl: "Circom 2",
  //   arithmetization: "R1CS",
  //   proof_algorithm: "Spartan",
  //   elliptic_curve: "Secp256k1",
  //   finite_field: "Z_(2^256-2^32-977)",
  //   build_properties: {
  //     instance_path: "instances/simple_hash_1_1.circom",
  //   },
  //   circuit_driver_id: "SPARTAN_CIRCOM_1",
  //   driver_version: "0.1.0",
  //   driver_properties: {
  //     wtns_gen_url: "",
  //     circuit_url: "",
  //   },
  //   raw_circuit_inputs_meta: [
  //     {
  //       label: "s",
  //       desc: "Hash argument",
  //       type: "FIELD_ELEMENT",
  //     },
  //     {
  //       label: "image",
  //       desc: "Hash result",
  //       type: "FIELD_ELEMENT",
  //       public: true,
  //     },
  //   ],
  // },
];

export default circuits;
