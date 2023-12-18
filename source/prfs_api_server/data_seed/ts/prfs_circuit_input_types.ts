import { PrfsCircuitInputType } from "@taigalabs/prfs-entities/bindings/PrfsCircuitInputType";

const circuit_input_types: PrfsCircuitInputType[] = [
  {
    circuit_input_type: "SIG_DATA_1",
    properties_meta: [
      {
        name: "msgRaw",
        label: "Message raw",
        desc: "Raw string upon which e-signature has been made",
        type: "string",
        show_priority: 0,
      },
      {
        name: "msgHash",
        label: "Message hash",
        desc: "Hash result of a message raw",
        type: "Buffer",
      },
      {
        name: "sig",
        label: "Signature",
        desc: "E-signature",
        type: "string",
      },
    ],
  },
  {
    circuit_input_type: "MERKLE_PROOF_1",
    properties_meta: [
      {
        name: "root",
        label: "Root",
        desc: "Root of a merkle tree",
        type: "bigint",
      },
      {
        name: "siblings",
        label: "Sibling nodes",
        desc: "Sibling nodes in climbing up the tree",
        type: "bigint[]",
      },
      {
        name: "pathIndices",
        label: "Path indices",
        desc: "Either left of right at a level with respect to sibling of a merkle tree",
        type: "number[]",
      },
    ],
  },
  {
    circuit_input_type: "HASH_DATA_1",
    properties_meta: [
      {
        name: "hashArgRaw",
        label: "Hash arg raw",
        desc: "Hash arg raw",
        type: "string",
      },
      {
        name: "hashArgHash",
        label: "Hash arg hash",
        desc: "Hash arg hash",
        type: "Buffer",
      },
      {
        name: "hashImage",
        label: "Hash image",
        desc: "Hash image",
        type: "string",
      },
    ],
  },
];

export default circuit_input_types;
