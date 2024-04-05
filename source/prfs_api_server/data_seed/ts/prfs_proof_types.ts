import circuitBuiltJson from "@taigalabs/prfs-circuits-circom/build/build.json";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { CircuitTypeData } from "@taigalabs/prfs-circuit-interface/bindings/CircuitTypeData";
import {
  MERKLE_SIG_POS_RANGE_V1,
  SIMPLE_HASH_V1,
  MERKLE_SIG_POS_EXACT_V1,
} from "@taigalabs/prfs-circuit-interface";
import path from "path";
import fs from "fs";

const proofTypeIds = {
  SIMPLE_HASH_1: "SIMPLE_HASH_1",
  CRYPTO_ASSET_SIZE_V1: "CRYPTO_ASSET_SIZE_V1",
  NONCE_SEOUL_1: "NONCE_SEOUL_1",
};

const proofTypeDesc = (() => {
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

const proof_types: PrfsProofType[] = [
  {
    proof_type_id: proofTypeIds.SIMPLE_HASH_1,
    label: "Simple hash",
    author: "Prfs",
    desc: proofTypeDesc.SIMPLE_HASH_1,
    expression: "Knows hash argument",
    img_url: "https://d1w1533jipmvi2.cloudfront.net/hash.png",
    circuit_id: circuitBuiltJson.circuits.simple_hash_v1.circuit_id,
    circuit_type_id: SIMPLE_HASH_V1,
    circuit_type_data: {
      type: "simple_hash_v1",
    } as CircuitTypeData,
    created_at: "2023-09-01T16:39:57-08:00",
    experimental: false,
  },
  {
    proof_type_id: proofTypeIds.CRYPTO_ASSET_SIZE_V1,
    label: "Cryto asset size claim",
    author: "Prfs",
    desc: proofTypeDesc.CRYPTO_ASSET_SIZE_V1,
    expression: "Has assets in crypto worth X USD",
    img_url: "https://d1w1533jipmvi2.cloudfront.net/money_cash_1.webp",
    circuit_id: circuitBuiltJson.circuits.merkle_sig_pos_range_v1.circuit_id,
    circuit_type_id: MERKLE_SIG_POS_RANGE_V1,
    circuit_type_data: {
      type: "merkle_sig_pos_range_v1",
      prfs_set_id: "crypto_holders",
      range_data: {
        label: "Asset size in USD",
        options: [
          {
            label: "$0-$10",
            lower_bound: BigInt(0),
            upper_bound: BigInt(10),
          },
          {
            label: "$10-$1K",
            lower_bound: BigInt(10),
            upper_bound: BigInt(1000),
          },
          {
            label: "$1K-$10K",
            lower_bound: BigInt(1000),
            upper_bound: BigInt(10000),
          },
          {
            label: "$10K-$100K",
            lower_bound: BigInt(10000),
            upper_bound: BigInt(100000),
          },
          {
            label: "$100K-$1M",
            lower_bound: BigInt(100000),
            upper_bound: BigInt(1000000),
          },
          {
            label: "$1M-$10M",
            lower_bound: BigInt(1000000),
            upper_bound: BigInt(10000000),
          },
          {
            label: "$10M-$50M",
            lower_bound: BigInt(10000000),
            upper_bound: BigInt(50000000),
          },
          {
            label: "$50M-$1B",
            lower_bound: BigInt(50000000),
            upper_bound: BigInt(1000000000),
          },
        ],
      },
    } as CircuitTypeData,
    created_at: "2024-01-29T16:39:57-08:00",
    experimental: false,
  },
  {
    proof_type_id: proofTypeIds.NONCE_SEOUL_1,
    label: "Nonce community Seoul",
    author: "Prfs",
    desc: proofTypeDesc.NONCE_SEOUL_1,
    expression: "Is a member of the group with some value",
    img_url: "https://d1w1533jipmvi2.cloudfront.net/nonce.jpeg",
    circuit_id: circuitBuiltJson.circuits.merkle_sig_pos_exact_v1.circuit_id,
    circuit_type_id: MERKLE_SIG_POS_EXACT_V1,
    circuit_type_data: {
      type: "merkle_sig_pos_exact_v1",
      prfs_set_id: "nonce_seoul_1",
    } as CircuitTypeData,
    created_at: "2024-01-29T16:39:57-08:00",
    experimental: false,
  },
];

export default proof_types;
