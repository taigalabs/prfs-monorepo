import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { CircuitTypeData } from "@taigalabs/prfs-circuit-interface/bindings/CircuitTypeData";
import { SimpleHashV1Data } from "@taigalabs/prfs-circuit-interface/bindings/SimpleHashV1Data";
import { MerkleSigPosRangeV1Data } from "@taigalabs/prfs-circuit-interface/bindings/MerkleSigPosRangeV1Data";
import {
  MERKLE_SIG_POS_RANGE_V1,
  MERKLE_SIG_POS_RANGE_V1_CIRCUIT_ID,
  SIMPLE_HASH_V1,
  SIMPLE_HASH_V1_CIRCUIT_ID,
} from "@taigalabs/prfs-circuit-interface";
import path from "path";
import fs from "fs";
import { SPARTAN_CIRCOM_V1 } from "@taigalabs/prfs-driver-interface";

const proofTypeIds = {
  ETH_0_0001_1: "ETH_0_0001_1",
  SIMPLE_HASH_1: "SIMPLE_HASH_1",
  CRYPTO_ASSET_SIZE_V1: "CRYPTO_ASSET_SIZE_V1",
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
  // {
  //   proof_type_id: proofTypeIds.ETH_0_0001_1,
  //   label: "0.0001ETH ownership",
  //   author: "Prfs",
  //   desc: proofTypes.ETH_0_0001_1,
  //   // "Prove you are one of the wallet owners of a list of all wallets that have 0.0001-0.0002 ETH",
  //   expression: "Owns 0.0001 ETH",
  //   img_url: "https://d1w1533jipmvi2.cloudfront.net/Ethereum_logo_translucent.svg",
  //   img_caption: "0.0001",
  //   circuit_id: "00000000-0000-0000-0000-000000000000",
  //   circuit_type_id: ADDR_MEMBERSHIP2_V1_CIRCUIT_TYPE_ID,
  //   circuit_driver_id: SPARTAN_DRIVER_V1_ID,
  //   created_at: "2023-05-01T16:39:57-08:00",
  // },
  {
    proof_type_id: proofTypeIds.SIMPLE_HASH_1,
    label: "Simple hash",
    author: "Prfs",
    desc: proofTypeDesc.SIMPLE_HASH_1,
    expression: "Knows hash argument",
    img_url: "https://d1w1533jipmvi2.cloudfront.net/hash.png",
    img_caption: "",
    circuit_id: SIMPLE_HASH_V1_CIRCUIT_ID,
    circuit_type_id: SIMPLE_HASH_V1,
    circuit_type_data: {
      type: "simple_hash_v1",
    } as CircuitTypeData,
    circuit_driver_id: SPARTAN_CIRCOM_V1,
    created_at: "2023-09-01T16:39:57-08:00",
  },
  {
    proof_type_id: proofTypeIds.CRYPTO_ASSET_SIZE_V1,
    label: "Cryto asset size claim",
    author: "Prfs",
    desc: proofTypeDesc.CRYPTO_ASSET_SIZE_V1,
    expression: "Has assets in crypto worth X USD",
    img_url: "https://d1w1533jipmvi2.cloudfront.net/money-cash-icon-png.webp",
    img_caption: null,
    circuit_id: MERKLE_SIG_POS_RANGE_V1_CIRCUIT_ID,
    circuit_type_id: MERKLE_SIG_POS_RANGE_V1,
    circuit_type_data: {
      type: "merkle_sig_pos_range_v1",
      prfs_set_id: "crypto_holders",
    } as CircuitTypeData,
    circuit_driver_id: SPARTAN_CIRCOM_V1,
    created_at: "2024-01-29T16:39:57-08:00",
  },
];

export default proof_types;
