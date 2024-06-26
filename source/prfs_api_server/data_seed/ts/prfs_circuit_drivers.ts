import { PrfsCircuitDriver } from "@taigalabs/prfs-entities/bindings/PrfsCircuitDriver";

const circuit_drivers: PrfsCircuitDriver[] = [
  {
    circuit_driver_id: "SPARTAN_CIRCOM_1",
    label: "Spartan Circom 1",
    driver_repository_url:
      "https://github.com/taigalabs/prfs-monorepo/tree/main/source/prfs_driver_spartan_js",
    driver_properties_meta: [
      {
        label: "instance_path",
        type: "",
        desc: "Relatve path to instance file",
      },
      {
        label: "wtns_gen_url",
        type: "",
        desc: "Wtns gen URL",
      },
      {
        label: "circuit_url",
        type: "",
        desc: "Circuit (compiled) URL",
      },
    ],
    version: "0.1.0",
    author: "Personae Labs",
    created_at: "2023-05-01T16:39:57-08:00",
    desc: "High-speed zkSNARKs without trusted setup",
    circuit_type_ids: ["MEMBERSHIP_PROOF_1"],
  },
];

export default circuit_drivers;
