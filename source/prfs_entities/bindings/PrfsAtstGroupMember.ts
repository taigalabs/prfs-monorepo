// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { PrfsAtstGroupId } from "./PrfsAtstGroupId";
import type { PrfsAtstGroupMemberCodeType } from "./PrfsAtstGroupMemberCodeType";
import type { PrfsAtstGroupMemberStatus } from "./PrfsAtstGroupMemberStatus";

export type PrfsAtstGroupMember = {
  atst_group_id: PrfsAtstGroupId;
  member_id: string;
  member_code: string;
  code_type: PrfsAtstGroupMemberCodeType;
  status: PrfsAtstGroupMemberStatus;
};
