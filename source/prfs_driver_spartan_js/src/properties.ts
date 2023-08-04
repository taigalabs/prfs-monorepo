export interface SpartanProgramProperties {
  wtns_gen_url: string;
  circuit_url: string;
  instance_path: string;
}

export function castToSpartanProgramProps(record: Record<string, any>): SpartanProgramProperties {
  if (record["wtns_gen_url"] === undefined) {
    throw new Error("wtns gen url missing");
  }

  if (record["circuit_url"] === undefined) {
    throw new Error("circuit url missing");
  }

  if (record["instance_path"] === undefined) {
    throw new Error("instance path missing");
  }

  return {
    wtns_gen_url: record["wtns_gen_url"],
    circuit_url: record["circuit_url"],
    instance_path: record["instance_path"],
  };
}
