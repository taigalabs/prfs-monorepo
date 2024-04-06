"use client";

import React from "react";
import { useRerender } from "@taigalabs/prfs-react-lib/src/hooks/use_rerender";
import { AlertContent, AlertWrapper } from "@taigalabs/prfs-react-lib/src/alert/AlertComponents";

import styles from "./GroupMemberAtstList.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  AttestationsHeader,
  AttestationsHeaderRow,
  AttestationsTitle,
} from "@/components/attestations/AttestationComponents";
import { AttestationsTopMenu } from "@/components/sets/SetComponents";
import { useSignedInProofUser } from "@/hooks/user";
import { isMasterAccountId } from "@/mock/mock_data";
import ComputeTotalValueDialog from "./ComputeTotalValue";
import GroupMemberAtstTable from "./GroupMemberAtstTable";

const GroupMemberAtstList: React.FC<CryptoSizeAtstListProps> = () => {
  const i18n = React.useContext(i18nContext);
  const { prfsProofCredential } = useSignedInProofUser();
  const { nonce, rerender } = useRerender();

  return (
    <>
      <AttestationsHeader>
        <AttestationsHeaderRow>
          <AttestationsTitle className={styles.title}>
            {i18n.group_member_attestations}
          </AttestationsTitle>
          <AttestationsTopMenu>
            {isMasterAccountId(prfsProofCredential?.account_id) && (
              <li>
                <ComputeTotalValueDialog credential={prfsProofCredential!} rerender={rerender} />
              </li>
            )}
          </AttestationsTopMenu>
        </AttestationsHeaderRow>
        <AttestationsHeaderRow>
          <AlertWrapper variant="warn" rounded>
            <AlertContent>
              Prfs attestation has been upgraded to version 0.2. Those that have created the older
              version (prior to 2024 Apr 03) should create an attestation again to continue to use
              it
            </AlertContent>
          </AlertWrapper>
        </AttestationsHeaderRow>
      </AttestationsHeader>
      <div>
        <GroupMemberAtstTable nonce={nonce} />
      </div>
    </>
  );
};

export default GroupMemberAtstList;

export interface CryptoSizeAtstListProps {}
