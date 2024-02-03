import { PrfsCircuit } from "@taigalabs/prfs-entities/bindings/PrfsCircuit";

export const ADDR_MEMBERSHIP2_V1_CIRCUIT_TYPE_ID = "addr_membership2_v1";
export const SIMPLE_HASH_V1_CIRCUIT_TYPE_ID = "simple_hash_v1";
export const MERKLE_POS_RANGE_V1_CIRCUIT_TYPE_ID = "merkle_pos_range_v1";

export const MERKLE_POS_RANGE_V1_CIRCUIT_ID =
  "0x0000000000000000000000000000000000000000000000000000000000000002";

// const circuits: PrfsCircuit[] = [
//   {
//     circuit_id: "00000000-0000-0000-0000-000000000000",
//     circuit_type_id: ADDR_MEMBERSHIP2_V1_CIRCUIT_TYPE_ID,
//     created_at: "2023-05-01T16:39:57-08:00",
//     label: "addr_membership2_1",
//     author: "SYSTEM_NATIVE",
//     num_public_inputs: 0,
//     desc: "Prove address membership (ECDSA, Poseidon)",
//     circuit_dsl: "Circom 2",
//     arithmetization: "R1CS",
//     proof_algorithm: "Spartan",
//     elliptic_curve: "Secp256k1",
//     finite_field: "Z_(2^256-2^32-977)",
//     circuit_driver_id: "SPARTAN_CIRCOM_1",
//     driver_version: "0.1.0",
//     build_properties: {
//       instance_path: "instances/addr_membership2_v1.circom",
//     },
//     driver_properties: {
//       wtns_gen_url: "",
//       circuit_url: "",
//     },
//     raw_circuit_inputs_meta: [
//       {
//         label: "Tx",
//         desc: "Tx description",
//         type: "FIELD_ELEMENT",
//         public: true,
//       },
//       {
//         label: "Ty",
//         desc: "Ty description",
//         type: "FIELD_ELEMENT",
//         public: true,
//       },
//       {
//         label: "Ux",
//         desc: "Ux description",
//         type: "FIELD_ELEMENT",
//         public: true,
//       },
//       {
//         label: "Uy",
//         desc: "Uy description",
//         type: "FIELD_ELEMENT",
//         public: true,
//       },
//       {
//         label: "Merkle root",
//         desc: "Vector commitment (Merkle root) of a set",
//         type: "FIELD_ELEMENT",
//         public: true,
//       },
//       {
//         label: "Serial number",
//         desc: "A cryptographic commitment made out of 's'",
//         type: "FIELD_ELEMENT",
//         public: true,
//       },
//       {
//         label: "m",
//         desc: "Message",
//         type: "FIELD_ELEMENT",
//       },
//       {
//         label: "r",
//         desc: "R value of a signature",
//         type: "FIELD_ELEMENT",
//       },
//       {
//         label: "s",
//         desc: "S value of a siganture",
//         type: "FIELD_ELEMENT",
//       },
//       {
//         label: "pathIndices",
//         desc: "Merkle path indices",
//         type: "FIELD_ELEMENT_VECTOR",
//       },
//       {
//         label: "siblings",
//         desc: "Siblings of a leaf in a Merkle path towards the root",
//         type: "FIELD_ELEMENT_VECTOR",
//       },
//     ],
//   },
//   {
//     circuit_id: "00000000-0000-0000-0000-000000000001",
//     circuit_type_id: SIMPLE_HASH_V1_CIRCUIT_TYPE_ID,
//     created_at: "2023-10-01T16:39:57-08:00",
//     label: "simple_hash_1_1",
//     author: "SYSTEM_NATIVE",
//     num_public_inputs: 0,
//     desc: "Simple Poseidon hash function",
//     circuit_dsl: "Circom 2",
//     arithmetization: "R1CS",
//     proof_algorithm: "Spartan",
//     elliptic_curve: "Secp256k1",
//     finite_field: "Z_(2^256-2^32-977)",
//     build_properties: {
//       instance_path: "instances/simple_hash_v1.circom",
//     },
//     circuit_driver_id: "SPARTAN_CIRCOM_1",
//     driver_version: "0.1.0",
//     driver_properties: {
//       wtns_gen_url: "",
//       circuit_url: "",
//     },
//     raw_circuit_inputs_meta: [
//       {
//         label: "s",
//         desc: "Hash argument",
//         type: "FIELD_ELEMENT",
//       },
//       {
//         label: "image",
//         desc: "Hash result",
//         type: "FIELD_ELEMENT",
//         public: true,
//       },
//     ],
//   },
//   {
//     circuit_id: MERKLE_POS_RANGE_V1_CIRCUIT_ID,
//     circuit_type_id: MERKLE_POS_RANGE_V1_CIRCUIT_TYPE_ID,
//     created_at: "2024-02-02T00:00:00-00:00",
//     label: "Merkle pos range v1",
//     author: "SYSTEM_NATIVE",
//     num_public_inputs: 0,
//     desc: "Merkle pos range v1",
//     circuit_dsl: "Circom 2",
//     arithmetization: "R1CS",
//     proof_algorithm: "Spartan",
//     elliptic_curve: "Secp256k1",
//     finite_field: "Z_(2^256-2^32-977)",
//     build_properties: {
//       instance_path: "instances/merkle_pos_range_v1.circom",
//     },
//     circuit_driver_id: "SPARTAN_CIRCOM_1",
//     driver_version: "0.1.0",
//     driver_properties: {
//       wtns_gen_url: "",
//       circuit_url: "",
//     },
//     raw_circuit_inputs_meta: [
//       {
//         label: "leaf",
//         desc: "Leaf of a tree",
//         type: "FIELD_ELEMENT",
//       },
//       {
//         label: "Merkle root",
//         desc: "Vector commitment (Merkle root) of a set",
//         type: "FIELD_ELEMENT",
//         public: true,
//       },
//       {
//         label: "pathIndices",
//         desc: "Merkle path indices",
//         type: "FIELD_ELEMENT_VECTOR",
//       },
//       {
//         label: "siblings",
//         desc: "Siblings of a leaf in a Merkle path towards the root",
//         type: "FIELD_ELEMENT_VECTOR",
//       },
//       // {
//       //   label: "Serial number",
//       //   desc: "A cryptographic commitment made out of 's'",
//       //   type: "FIELD_ELEMENT",
//       //   public: true,
//       // },
//     ],
//   },
// ];

// export default circuits;
