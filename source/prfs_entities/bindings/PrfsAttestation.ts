// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { PrfsAtstGroupId } from "./PrfsAtstGroupId";
import type { PrfsAtstStatus } from "./PrfsAtstStatus";
import type { PrfsAtstVersion } from "./PrfsAtstVersion";

export type PrfsAttestation = {
  atst_id: string;
  atst_group_id: PrfsAtstGroupId;
  label: string;
  member_label: string | null;
  cm: string;
  meta: Record<string, string>;
  status: PrfsAtstStatus;
  value: Record<string, string>[];
  atst_version: PrfsAtstVersion;
};
