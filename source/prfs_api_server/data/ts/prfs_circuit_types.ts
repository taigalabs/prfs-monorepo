import { PrfsCircuitType } from "@taigalabs/prfs-entities/bindings/PrfsCircuitType";

const circuit_types: PrfsCircuitType[] = [
  {
    circuit_type: "MEMBERSHIP_PROOF_1",
    author: "SYSTEM_NATIVE",
    created_at: "2023-05-01T16:39:57-08:00",
    desc: "Group membership proof",
    circuit_inputs_meta: [
      {
        name: "sigData",
        label: "Signature data",
        desc: "Message raw, Message hash, and a signature over the message hash",
        type: "SIG_DATA_1",
        show_priority: 0,
      },
      {
        name: "merkleProof",
        label: "Merkle proof",
        desc: "Vector commitment (Merkle root) of a set",
        type: "MERKLE_PROOF_1",
        ref: "PRFS_SET",
      },
    ],
    public_inputs_meta: [
      {
        name: "r",
        label: "r",
        desc: "'s' element of elliptic curve signature",
        type: "BIGINT",
      },
      {
        name: "rV",
        label: "v",
        desc: "'v' element of elliptic curve signature",
        type: "BIGINT",
      },
      {
        name: "msgRaw",
        label: "Message raw",
        desc: "Message over which a digital signature is made",
        type: "STRING",
        show_priority: 0,
      },
      {
        name: "msgHash",
        label: "Message hash",
        desc: "Message hash in u8 array",
        type: "BUFFER",
      },
      {
        name: "circuitPubInput",
        label: "Circuit public input",
        desc: "Raw public inputs that go into circuit to verify",
        type: "JSON",
      },
    ],
  },
  {
    circuit_type: "SIMPLE_HASH_1",
    author: "SYSTEM_NATIVE",
    created_at: "2023-10-01T16:39:57-08:00",
    desc: "Simple hash proof 1",
    circuit_inputs_meta: [
      {
        name: "sigData",
        label: "Signature data",
        desc: "Message raw, Message hash, and a signature over the message hash",
        type: "SIG_DATA_1",
        show_priority: 0,
      },
    ],
    public_inputs_meta: [
      {
        name: "msgRaw",
        label: "Message raw",
        desc: "Message over which a digital signature is made",
        type: "STRING",
        show_priority: 0,
      },
      {
        name: "msgHash",
        label: "Message hash",
        desc: "Message hash in u8 array",
        type: "BUFFER",
      },
      {
        name: "circuitPubInput",
        label: "Circuit public input",
        desc: "Raw public inputs that go into circuit to verify",
        type: "JSON",
      },
    ],
  },
];

export default circuit_types;
