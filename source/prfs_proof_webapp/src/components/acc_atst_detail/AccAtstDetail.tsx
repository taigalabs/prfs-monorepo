"use client";

import React from "react";
import cn from "classnames";
import { FaArrowLeft } from "@react-icons/all-files/fa/FaArrowLeft";
import ButtonCircleContainer from "@taigalabs/prfs-react-lib/src/button_circle_container/ButtonCircleContainer";
import { atstApi } from "@taigalabs/prfs-api-js";
import { i18nContext } from "@/i18n/context";
import { useQuery } from "@taigalabs/prfs-react-lib/react_query";
import Link from "next/link";

import styles from "./AccAtstDetail.module.scss";
import { paths } from "@/paths";
import {
  AttestationDetailBox,
  AttestationDetailBoxInner,
  AttestationDetailSection,
  AttestationDetailSectionRow,
  AttestationDetailSectionRowLabel,
  AttestationDetailTopMenuRow,
} from "@/components/attestation_detail/AttestationDetail";

const AccAtstDetail: React.FC<AccAtstDetailProps> = ({ atst_id }) => {
  const i18n = React.useContext(i18nContext);
  const { isLoading, data, error } = useQuery({
    queryKey: ["get_twitter_acc_atst"],
    queryFn: async () => {
      const { payload } = await atstApi("get_twitter_acc_atst", {
        acc_atst_id: atst_id,
      });
      return payload;
    },
  });

  if (isLoading) {
    <div>Loading...</div>;
  }

  if (error) {
    <div>Fetch error: {error.toString()}</div>;
  }

  const atst = data?.prfs_acc_atst;

  const avatarUrl = React.useMemo(() => {
    if (atst) {
      return atst.avatar_url.replace("_normal.", ".");
    } else {
      return null;
    }
  }, [atst]);

  return (
    atst && (
      <div className={styles.wrapper}>
        <AttestationDetailTopMenuRow>
          <Link href={paths.attestations__twitter}>
            <ButtonCircleContainer>
              <FaArrowLeft />
            </ButtonCircleContainer>
          </Link>
        </AttestationDetailTopMenuRow>
        <div className={styles.avatarRow}>
          <img
            className={styles.avatar}
            src={avatarUrl ?? atst.avatar_url}
            crossOrigin=""
            alt={i18n.avatar}
          />
          <div className={styles.rightCol}>
            <div className={styles.username}>{atst.username}</div>
            <div className={styles.accountId}>{atst.account_id}</div>
          </div>
        </div>
        <AttestationDetailSection className={styles.metaRow}>
          <AttestationDetailBox>
            <AttestationDetailBoxInner>
              <AttestationDetailSectionRow>
                <AttestationDetailSectionRowLabel>
                  {i18n.commitment}
                </AttestationDetailSectionRowLabel>
                <div className={cn(styles.commitment, styles.value)}>{atst.cm}</div>
              </AttestationDetailSectionRow>
              <AttestationDetailSectionRow>
                <AttestationDetailSectionRowLabel>
                  {i18n.document_url}
                </AttestationDetailSectionRowLabel>
                <div className={cn(styles.url, styles.value)}>
                  <a href={atst.document_url} target="_blank">
                    {atst.document_url}
                  </a>
                </div>
              </AttestationDetailSectionRow>
              <AttestationDetailSectionRow>
                <AttestationDetailSectionRowLabel>
                  {i18n.destination}
                </AttestationDetailSectionRowLabel>
                <div className={cn(styles.destination, styles.value)}>{atst.dest}</div>
              </AttestationDetailSectionRow>
              <AttestationDetailSectionRow>
                <AttestationDetailSectionRowLabel>
                  {i18n.attestation_type}
                </AttestationDetailSectionRowLabel>
                <div className={cn(styles.attestationType, styles.value)}>{atst.atst_type}</div>
              </AttestationDetailSectionRow>
              <AttestationDetailSectionRow>
                <AttestationDetailSectionRowLabel>{i18n.status}</AttestationDetailSectionRowLabel>
                <div className={cn(styles.status, styles.value)}>{atst.status}</div>
              </AttestationDetailSectionRow>
              <AttestationDetailSectionRow>
                <AttestationDetailSectionRowLabel>{i18n.on_chain}</AttestationDetailSectionRowLabel>
                <div className={cn(styles.onChain, styles.value)}>{i18n.not_available}</div>
              </AttestationDetailSectionRow>
              <AttestationDetailSectionRow>
                <AttestationDetailSectionRowLabel>
                  {i18n.notarized}
                </AttestationDetailSectionRowLabel>
                <div className={cn(styles.notarized, styles.value)}>{i18n.not_available}</div>
              </AttestationDetailSectionRow>
            </AttestationDetailBoxInner>
          </AttestationDetailBox>
        </AttestationDetailSection>
      </div>
    )
  );
};

export default AccAtstDetail;

export interface AccAtstDetailProps {
  atst_id: string;
}
