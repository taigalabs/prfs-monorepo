export const ATST_GROUP_ID = "atst_group_id";
export const ATST_TYPE_ID = "atst_type_id";
export const MEMBER_CODE = "member_code";
export const CM = "commitment";

export type GroupMemberAtstFormData = {
  [ATST_GROUP_ID]: string;
  [ATST_TYPE_ID]: string;
  [MEMBER_CODE]: string;
  [CM]: string;
};
