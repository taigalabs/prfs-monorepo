import { PrfsCircuitProgram } from "@/models";
import { api } from "./utils";
import { PrfsApiResponse } from "./types";

export interface GetNativeCircuitProgramsRequest {
  page: number;
  program_id?: string;
}

export type GetNativeCircuitProgramsResponse = PrfsApiResponse<{
  page: number;
  prfs_circuit_programs: PrfsCircuitProgram[];
}>;

export async function getPrfsNativeCircuitPrograms({
  page,
  program_id,
}: GetNativeCircuitProgramsRequest) {
  let req: GetNativeCircuitProgramsRequest = {
    page,
    program_id,
  };

  try {
    let resp: GetNativeCircuitProgramsResponse = await api({
      path: `get_prfs_native_circuit_programs`,
      req,
    });
    return resp;
  } catch (err) {
    console.log("error fetching", err);
  }
}
