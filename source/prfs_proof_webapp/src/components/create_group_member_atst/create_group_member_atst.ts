export const ATST_TYPE_ID = "atst_type_id";
export const MEMBER_CODE = "member_code";
export const CM = "commitment";

export const MEMBER_ID = "member_id";
export const MEMBER_ID_CM = "member_id_cm";
export const MEMBER_ID_ENC = "member_id_enc";
export const ENCRYPTED_MEMBER_ID = "encrypted_member_id";

export type GroupMemberAtstFormData = {
  [MEMBER_CODE]: string;
  [MEMBER_ID]: string;
  [CM]: string;
  [MEMBER_ID_ENC]: string;
};
