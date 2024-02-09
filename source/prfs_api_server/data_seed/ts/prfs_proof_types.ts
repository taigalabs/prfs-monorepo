import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import {
  ADDR_MEMBERSHIP2_V1_CIRCUIT_TYPE_ID,
  SIMPLE_HASH_V1_CIRCUIT_TYPE_ID,
  MERKLE_POS_RANGE_V1_CIRCUIT_TYPE_ID,
  MERKLE_POS_RANGE_INPUT_TYPE_V1,
  MERKLE_POS_RANGE_V1_CIRCUIT_ID,
} from "@taigalabs/prfs-circuit-interface";
import path from "path";
import fs from "fs";

const proofTypeIds = {
  ETH_0_0001_1: "ETH_0_0001_1",
  BAYC_1: "BAYC_1",
  NONCE_MEMBER_1: "NONCE_MEMBER_1",
  AAVE_STAKERS_1: "AAVE_STAKERS_1",
  ZAUTH_SIGN_IN_1: "ZAUTH_SIGN_IN_1",
  SIMPLE_HASH_1: "SIMPLE_HASH_1",
  CONSUMER_CRYPTO_HACKERS_1: "CONSUMER_CRYPTO_HACKERS_1",
  "2023_ETH_GLOBAL_ISTANBUL_HACKERS": "2023_ETH_GLOBAL_ISTANBUL_HACKERS",
  CRYPTO_ASSET_SIZE_V1: "CRYPTO_ASSET_SIZE_V1",
};

const proofTypes = (() => {
  const currDir = path.dirname(__filename);

  const proofTypes = { ...proofTypeIds };

  let key: keyof typeof proofTypeIds;
  for (key in proofTypes) {
    const val = proofTypeIds[key];
    const filePath = path.resolve(currDir, `../proof_types/${val}.md`);
    const md = fs.readFileSync(filePath).toString();

    proofTypes[key] = md;
  }

  return proofTypes;
})();

const ADDR_MEMBERSHIP2_V1_CIRCUIT_URL = `prfs://${ADDR_MEMBERSHIP2_V1_CIRCUIT_TYPE_ID}/${ADDR_MEMBERSHIP2_V1_CIRCUIT_TYPE_ID}.spartan.circuit`;

const ADDR_MEMBERSHIP2_V1_WTNS_GEN_URL = `prfs://${ADDR_MEMBERSHIP2_V1_CIRCUIT_TYPE_ID}/${ADDR_MEMBERSHIP2_V1_CIRCUIT_TYPE_ID}_js/${ADDR_MEMBERSHIP2_V1_CIRCUIT_TYPE_ID}.wasm`;

const SIMPLE_HASH_V1_CIRCUIT_URL = `prfs://${SIMPLE_HASH_V1_CIRCUIT_TYPE_ID}/${SIMPLE_HASH_V1_CIRCUIT_TYPE_ID}.spartan.circuit`;

const SIMPLE_HASH_V1_WTNS_GEN_URL = `prfs://${SIMPLE_HASH_V1_CIRCUIT_TYPE_ID}/${SIMPLE_HASH_V1_CIRCUIT_TYPE_ID}_js/${SIMPLE_HASH_V1_CIRCUIT_TYPE_ID}.wasm`;

const MERKLE_POS_RANGE_V1_CIRCUIT_URL = `prfs://${MERKLE_POS_RANGE_V1_CIRCUIT_TYPE_ID}/${MERKLE_POS_RANGE_V1_CIRCUIT_TYPE_ID}.spartan.circuit`;

const MERKLE_POS_RANGE_V1_WTNS_GEN_URL = `prfs://${MERKLE_POS_RANGE_V1_CIRCUIT_TYPE_ID}/${MERKLE_POS_RANGE_V1_CIRCUIT_TYPE_ID}_js/${MERKLE_POS_RANGE_V1_CIRCUIT_TYPE_ID}.wasm`;

const sig_data_circuit_input = {
  desc: "Message over which a signature is made",
  name: "sigData",
  type: "SIG_DATA_1",
  label: "Signature",
  value: "",
};

const simple_hash_1 = {
  desc: "Hash data",
  name: "hashData",
  type: "HASH_DATA_1",
  label: "Hash data",
  value: "",
};

const proof_types: PrfsProofType[] = [
  {
    proof_type_id: proofTypeIds.ETH_0_0001_1,
    label: "0.0001ETH ownership",
    author: "Prfs",
    desc: proofTypes.ETH_0_0001_1,
    // "Prove you are one of the wallet owners of a list of all wallets that have 0.0001-0.0002 ETH",
    expression: "Owns 0.0001 ETH",
    img_url: "https://d1w1533jipmvi2.cloudfront.net/Ethereum_logo_translucent.svg",
    img_caption: "0.0001",
    circuit_id: "00000000-0000-0000-0000-000000000000",
    circuit_type_id: ADDR_MEMBERSHIP2_V1_CIRCUIT_TYPE_ID,
    circuit_driver_id: "SPARTAN_CIRCOM_1",
    circuit_inputs: [
      {
        ref_type: "PRFS_SET",
        ref_value: "00000000-0000-0000-0000-000000000001",
        desc: "Who you are among those",
        name: "merkleProof",
        type: "MERKLE_PROOF_1",
        element_type: "ADDRESS",
        label: "Member",
        value: "",
      },
      sig_data_circuit_input,
    ],
    driver_properties: {
      version: "0.0.1",
      circuit_url: ADDR_MEMBERSHIP2_V1_CIRCUIT_URL,
      wtns_gen_url: ADDR_MEMBERSHIP2_V1_WTNS_GEN_URL,
    },
    created_at: "2023-05-01T16:39:57-08:00",
  },
  {
    proof_type_id: proofTypeIds.SIMPLE_HASH_1,
    label: "Simple hash",
    author: "Prfs",
    desc: proofTypes.SIMPLE_HASH_1,
    // "Proves he knows the preimage of a cryptographic hash function",
    expression: "Knows hash argument",
    img_url: "https://d1w1533jipmvi2.cloudfront.net/hash.png",
    img_caption: "",
    circuit_id: "00000000-0000-0000-0000-000000000001",
    circuit_type_id: SIMPLE_HASH_V1_CIRCUIT_TYPE_ID,
    circuit_driver_id: "SPARTAN_CIRCOM_1",
    circuit_inputs: [simple_hash_1],
    driver_properties: {
      version: "0.0.1",
      circuit_url: SIMPLE_HASH_V1_CIRCUIT_URL,
      wtns_gen_url: SIMPLE_HASH_V1_WTNS_GEN_URL,
    },
    created_at: "2023-09-01T16:39:57-08:00",
  },
  {
    proof_type_id: proofTypeIds.CRYPTO_ASSET_SIZE_V1,
    label: "Cryto asset size claim",
    author: "Prfs",
    desc: proofTypes.CRYPTO_ASSET_SIZE_V1,
    expression: "Has assets in crypto worth X USD",
    img_url: "https://d1w1533jipmvi2.cloudfront.net/money-cash-icon-png.webp",
    img_caption: null,
    circuit_id: MERKLE_POS_RANGE_V1_CIRCUIT_ID,
    circuit_type_id: MERKLE_POS_RANGE_V1_CIRCUIT_TYPE_ID,
    circuit_driver_id: "SPARTAN_CIRCOM_1",
    circuit_inputs: [
      {
        ref_type: "PRFS_SET",
        ref_value: "crypto_holders",
        desc: "Who you are among those",
        name: "merkleProof",
        type: MERKLE_POS_RANGE_INPUT_TYPE_V1,
        element_type: "ADDRESS",
        label: "Member",
        value: "",
      },
    ],
    driver_properties: {
      version: "0.0.1",
      circuit_url: MERKLE_POS_RANGE_V1_CIRCUIT_URL,
      wtns_gen_url: MERKLE_POS_RANGE_V1_WTNS_GEN_URL,
    },
    created_at: "2024-01-29T16:39:57-08:00",
  },
];

export default proof_types;
