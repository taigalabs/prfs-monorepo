export function resolvePath(app: string, segment: string) {
  return `/${app}/${segment}`;
}

export const paths = {
  __: "/",
  signin: "/signin",
  signup: "/signup",
  proof_wizard: "/#proof_wizard",
  proof_instances: "/proof_instances",
  proof_types: "/proof_types",
  circuits: "/circuits",
  circuit_drivers: "/circuit_drivers",
  circuit_types: "/circuit_types",
  sets: "/sets",
  dynamic_sets: "/dynamic_sets",
};
