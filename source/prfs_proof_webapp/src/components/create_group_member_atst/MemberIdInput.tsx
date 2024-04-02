import React from "react";
import cn from "classnames";
import {
  AttestationListItem,
  AttestationListItemBtn,
  AttestationListItemDesc,
  AttestationListItemDescTitle,
  AttestationListItemNo,
  AttestationListItemOverlay,
  AttestationListRightCol,
} from "@/components/create_attestation/CreateAtstComponents";
import { PrfsAtstGroup } from "@taigalabs/prfs-entities/bindings/PrfsAtstGroup";
import Input from "@taigalabs/prfs-react-lib/src/input/Input";

import styles from "./MemberIdInput.module.scss";
import { i18nContext } from "@/i18n/context";
import { GroupMemberAtstFormData, MEMBER_CODE, MEMBER_ID } from "./create_group_member_atst";

const MemberIdInput: React.FC<EncryptedWalletAddrItemProps> = ({
  atstGroup,
  formData,
  handleChangeMemberInfo,
}) => {
  const i18n = React.useContext(i18nContext);

  return (
    <>
      <AttestationListItem isDisabled={!atstGroup}>
        <AttestationListItemOverlay />
        <AttestationListItemNo>2</AttestationListItemNo>
        <AttestationListRightCol>
          <AttestationListItemDesc>
            <AttestationListItemDescTitle>
              {i18n.type_in_your_member_information}
            </AttestationListItemDescTitle>
          </AttestationListItemDesc>
          <div className={styles.inputArea}>
            <div>
              <p className={styles.guide}>Member Id can be your name for example</p>
              <Input
                name={MEMBER_ID}
                label={i18n.member_id}
                value={formData[MEMBER_ID]}
                type="text"
                handleChangeValue={handleChangeMemberInfo}
              />
            </div>
            <div>
              <p className={styles.guide}>Did you get a code to become registered in the group?</p>
              <Input
                name={MEMBER_CODE}
                label={i18n.member_code}
                value={formData[MEMBER_CODE]}
                type="text"
                handleChangeValue={handleChangeMemberInfo}
              />
            </div>
          </div>
        </AttestationListRightCol>
      </AttestationListItem>
    </>
  );
};

export default MemberIdInput;

export interface EncryptedWalletAddrItemProps {
  atstGroup: PrfsAtstGroup | null;
  formData: GroupMemberAtstFormData;
  handleChangeMemberInfo: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
