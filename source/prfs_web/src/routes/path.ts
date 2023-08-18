export function resolvePath(app: string, segment: string) {
  return `/${app}/${segment}`;
}

export const paths = {
  proof: "/proof",
  proof__proof_wizard: "/proof/#proof_wizard",
  proof__proof_instances: "proof/proof_instances",
  proof__proof_types: "proof/proof_types",
  proof__circuits: "proof/circuits",
  proof__circuit_drivers: "proof/circuit_drivers",
  proof__circuit_types: "proof/circuit_types",
  proof__sets: "proof/sets",
  proof__dynamic_sets: "proof/#dynamic_sets",
};
