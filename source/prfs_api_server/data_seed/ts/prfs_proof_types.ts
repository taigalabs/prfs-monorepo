import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
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

const ADDR_MEMBERSHIP2_1_CIRCUIT_URL =
  "prfs://00000000-0000-0000-0000-000000000000/addr_membership2_1.spartan.circuit";

const ADDR_MEMBERSHIP2_1_WTNS_GEN_URL =
  "prfs://00000000-0000-0000-0000-000000000000/addr_membership2_1_js/addr_membership2_1.wasm";

const SIMPLE_HASH_1_CIRCUIT_URL =
  "prfs://00000000-0000-0000-0000-000000000001/simple_hash_1_1.spartan.circuit";

const SIMPLE_HASH_1_WTNS_GEN_URL =
  "prfs://00000000-0000-0000-0000-000000000001/simple_hash_1_1_js/simple_hash_1_1.wasm";

const sig_data_circuit_input = {
  desc: "Message over which a signature is made",
  name: "sigData",
  type: "SIG_DATA_1",
  label: "Signature",
  value: "",
};

const merkle_sig_pos_range_v1_circuit_input = {
  desc: "Merkle proof with leaf as sig-poseidon with number in range",
  name: "merkle_sig_pos_range",
  type: "MERKLE_SIG_POS_RANGE_V1",
  label: "Member",
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
    circuit_type_id: "MEMBERSHIP_PROOF_1",
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
      circuit_url: ADDR_MEMBERSHIP2_1_CIRCUIT_URL,
      wtns_gen_url: ADDR_MEMBERSHIP2_1_WTNS_GEN_URL,
    },
    created_at: "2023-05-01T16:39:57-08:00",
  },
  {
    proof_type_id: proofTypeIds.BAYC_1,
    label: "Bored Ape Yacht Club holder",
    author: "Prfs",
    desc: proofTypes.BAYC_1,
    // "Prove you are one of the holders of BAYC tokens",
    expression: "Own BAYC token",
    img_url: "https://d1w1533jipmvi2.cloudfront.net/bayc-footer.webp",
    img_caption: "",
    circuit_id: "00000000-0000-0000-0000-000000000000",
    circuit_type_id: "MEMBERSHIP_PROOF_1",
    circuit_driver_id: "SPARTAN_CIRCOM_1",
    circuit_inputs: [
      {
        ref_type: "PRFS_SET",
        ref_value: "10000000-0000-0000-0000-100000000000",
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
      circuit_url: ADDR_MEMBERSHIP2_1_CIRCUIT_URL,
      wtns_gen_url: ADDR_MEMBERSHIP2_1_WTNS_GEN_URL,
    },
    created_at: "2023-08-01T16:39:57-08:00",
  },
  {
    proof_type_id: proofTypeIds.NONCE_MEMBER_1,
    label: "Nonce community member",
    author: "Prfs",
    desc: proofTypes.NONCE_MEMBER_1,
    // "This proves a person is a member of Web3 community - Nonce",
    expression: "Nonce member",
    img_url: "https://d1w1533jipmvi2.cloudfront.net/nonce.jpeg",
    img_caption: "",
    circuit_id: "00000000-0000-0000-0000-000000000000",
    circuit_type_id: "MEMBERSHIP_PROOF_1",
    circuit_driver_id: "SPARTAN_CIRCOM_1",
    circuit_inputs: [
      {
        ref_type: "PRFS_SET",
        ref_value: "10000000-0000-0000-0000-000000000001",
        desc: "Who you are among those",
        name: "merkleProof",
        type: "MERKLE_PROOF_1",
        label: "Member",
        element_type: "ADDRESS",
        value: "",
      },
      sig_data_circuit_input,
    ],
    driver_properties: {
      version: "0.0.1",
      circuit_url: ADDR_MEMBERSHIP2_1_CIRCUIT_URL,
      wtns_gen_url: ADDR_MEMBERSHIP2_1_WTNS_GEN_URL,
    },
    created_at: "2023-05-01T16:39:57-08:00",
  },
  {
    proof_type_id: proofTypeIds.AAVE_STAKERS_1,
    label: "Aave liquid stakers 150",
    author: "Prfs",
    desc: proofTypes.AAVE_STAKERS_1,
    // "Proves one is the liquid staker on Aave",
    expression: "Is Aave liquid staker",
    img_url: "https://d1w1533jipmvi2.cloudfront.net/aave.png",
    img_caption: "150",
    circuit_id: "00000000-0000-0000-0000-000000000000",
    circuit_type_id: "MEMBERSHIP_PROOF_1",
    circuit_driver_id: "SPARTAN_CIRCOM_1",
    circuit_inputs: [
      {
        ref_type: "PRFS_SET",
        ref_value: "10000000-0000-0000-0000-100000000002",
        desc: "Who you are among those",
        name: "merkleProof",
        type: "MERKLE_PROOF_1",
        label: "Member",
        element_type: "ADDRESS",
        value: "",
      },
      {
        desc: "Message over which a signature is made",
        name: "sigData",
        type: "SIG_DATA_1",
        label: "Signature",
        value: "",
      },
    ],
    driver_properties: {
      version: "0.0.1",
      circuit_url: ADDR_MEMBERSHIP2_1_CIRCUIT_URL,
      wtns_gen_url: ADDR_MEMBERSHIP2_1_WTNS_GEN_URL,
    },
    created_at: "2023-09-21T16:39:57-08:00",
  },
  {
    proof_type_id: proofTypeIds.ZAUTH_SIGN_IN_1,
    label: "ZAuth",
    author: "Prfs",
    desc: proofTypes.ZAUTH_SIGN_IN_1,
    // "ZAuth sign in",
    expression: "Passes ZAuth",
    img_url:
      "https://d1w1533jipmvi2.cloudfront.net/padlock-clipart-design-illustration-free-png.webp",
    img_caption: "0.0001",
    circuit_id: "00000000-0000-0000-0000-000000000000",
    circuit_type_id: "MEMBERSHIP_PROOF_1",
    circuit_driver_id: "SPARTAN_CIRCOM_1",
    circuit_inputs: [
      {
        desc: "passcode",
        name: "passcode",
        type: "PASSCODE",
        label: "Passcode",
        value: "",
      },
    ],
    driver_properties: {
      version: "0.0.1",
      circuit_url: ADDR_MEMBERSHIP2_1_CIRCUIT_URL,
      wtns_gen_url: ADDR_MEMBERSHIP2_1_WTNS_GEN_URL,
    },
    created_at: "2023-09-01T16:39:57-08:00",
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
    circuit_type_id: "SIMPLE_HASH_1",
    circuit_driver_id: "SPARTAN_CIRCOM_1",
    circuit_inputs: [simple_hash_1],
    driver_properties: {
      version: "0.0.1",
      circuit_url: SIMPLE_HASH_1_CIRCUIT_URL,
      wtns_gen_url: SIMPLE_HASH_1_WTNS_GEN_URL,
    },
    created_at: "2023-09-01T16:39:57-08:00",
  },
  {
    proof_type_id: proofTypeIds.CONSUMER_CRYPTO_HACKERS_1,
    label: "Consumer crypto hackers",
    author: "Prfs",
    desc: proofTypes.CONSUMER_CRYPTO_HACKERS_1,
    // "Proves he is one of the hackers at consumer crypto hackathon hosted by Paradigm VC",
    expression: "Is consumer crypto hacker",
    img_url: "https://d1w1533jipmvi2.cloudfront.net/paradigm_logo.jpg",
    img_caption: null,
    circuit_id: "00000000-0000-0000-0000-000000000000",
    circuit_type_id: "MEMBERSHIP_PROOF_1",
    circuit_driver_id: "SPARTAN_CIRCOM_1",
    circuit_inputs: [
      {
        ref_type: "PRFS_SET",
        ref_value: "10000000-0000-0000-0000-100000000003",
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
      circuit_url: ADDR_MEMBERSHIP2_1_CIRCUIT_URL,
      wtns_gen_url: ADDR_MEMBERSHIP2_1_WTNS_GEN_URL,
    },
    created_at: "2023-10-26T16:39:57-08:00",
  },
  {
    proof_type_id: proofTypeIds["2023_ETH_GLOBAL_ISTANBUL_HACKERS"],
    label: "2023 EthGlobal Istanbul hackers",
    author: "Prfs",
    desc: proofTypes["2023_ETH_GLOBAL_ISTANBUL_HACKERS"],
    // "Proves he is one of the hackers at 2023 EthGlobal Istanbul hackathon",
    expression: "Is 2023 EthGlobal Istanbul hacker",
    img_url: "https://d1w1533jipmvi2.cloudfront.net/2023_eth_global_istanbul_logo.png",
    img_caption: null,
    circuit_id: "00000000-0000-0000-0000-000000000000",
    circuit_type_id: "MEMBERSHIP_PROOF_1",
    circuit_driver_id: "SPARTAN_CIRCOM_1",
    circuit_inputs: [
      {
        ref_type: "PRFS_SET",
        ref_value: "10000000-0000-0000-0000-100000000004",
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
      circuit_url: ADDR_MEMBERSHIP2_1_CIRCUIT_URL,
      wtns_gen_url: ADDR_MEMBERSHIP2_1_WTNS_GEN_URL,
    },
    created_at: "2023-11-19T16:39:57-08:00",
  },
  {
    proof_type_id: proofTypeIds.CRYPTO_ASSET_SIZE_V1,
    label: "Cryto asset size claim",
    author: "Prfs",
    desc: proofTypes.CRYPTO_ASSET_SIZE_V1,
    expression: "Has assets in crypto worth X USD",
    img_url: "https://d1w1533jipmvi2.cloudfront.net/money-cash-icon-png.webp",
    img_caption: null,
    circuit_id: "00000000-0000-0000-0000-000000000000",
    circuit_type_id: "MEMBERSHIP_PROOF_1",
    circuit_driver_id: "SPARTAN_CIRCOM_1",
    circuit_inputs: [
      // {
      //   ref_type: "PRFS_SET",
      //   ref_value: "10000000-0000-0000-0000-100000000004",
      //   desc: "Who you are among those",
      //   name: "merkleProof",
      //   type: "MERKLE_PROOF_1",
      //   element_type: "ADDRESS",
      //   label: "Member",
      //   value: "",
      // },
      // sig_data_circuit_input,
      {
        ref_type: "PRFS_SET",
        ref_value: "crypto_holders",
        element_type: "COMMITMENT",
        ...merkle_sig_pos_range_v1_circuit_input,
      },
    ],
    driver_properties: {
      version: "0.0.1",
      circuit_url: ADDR_MEMBERSHIP2_1_CIRCUIT_URL,
      wtns_gen_url: ADDR_MEMBERSHIP2_1_WTNS_GEN_URL,
    },
    created_at: "2024-01-29T16:39:57-08:00",
  },
];

export default proof_types;
