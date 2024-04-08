import MasterAccountIds from "../json_bindings/master_account_ids.json";

export function isMasterAccount(id: string | undefined) {
  return id ? MasterAccountIds.includes(id) : false;
}
