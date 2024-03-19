"use client";

import React from "react";
import cn from "classnames";
import { FaArrowLeft } from "@react-icons/all-files/fa/FaArrowLeft";
import ButtonCircleContainer from "@taigalabs/prfs-react-lib/src/button_circle_container/ButtonCircleContainer";
import { prfsApi3, treeApi } from "@taigalabs/prfs-api-js";
import { i18nContext } from "@/i18n/context";
import { useQuery } from "@taigalabs/prfs-react-lib/react_query";
import Link from "next/link";

import styles from "./SetElementDetail.module.scss";
import { consolePaths, paths } from "@/paths";
import {
  AttestationDetailBox,
  AttestationDetailBoxInner,
  AttestationDetailSection,
  AttestationDetailSectionRow,
  AttestationDetailSectionRowLabel,
  AttestationDetailTopMenuRow,
} from "@/components/attestation_detail/AttestationDetail";

const SetElementDetail: React.FC<SetElementDetailProps> = ({ element_label, set_id }) => {
  const i18n = React.useContext(i18nContext);
  const { isLoading, data, error } = useQuery({
    queryKey: ["get_prfs_set_element", element_label],
    queryFn: async () => {
      return treeApi({
        type: "get_prfs_set_element",
        label: element_label,
        set_id,
      });
    },
  });
  const setElement = data?.payload?.prfs_set_element;
  const elementData = React.useMemo(() => {
    return setElement && JSON.stringify(setElement.data);
  }, [setElement?.data]);
  // const etherScanUrl = React.useMemo(() => {
  //   return atst && `https://etherscan.io/address/${atst.wallet_addr.toLowerCase()}`;
  // }, [atst?.wallet_addr]);

  if (isLoading) {
    <div>Loading...</div>;
  }

  if (error) {
    <div>Fetch error: {error.toString()}</div>;
  }

  return setElement ? (
    <div className={styles.wrapper}>
      <AttestationDetailTopMenuRow>
        <Link href={paths.sets__crypto_holders}>
          <ButtonCircleContainer>
            <FaArrowLeft />
          </ButtonCircleContainer>
        </Link>
      </AttestationDetailTopMenuRow>
      <div className={styles.avatarRow}>
        <div className={styles.rightCol}>
          <div className={styles.walletAddr}>{setElement.label}</div>
        </div>
      </div>
      <AttestationDetailSection className={styles.metaRow}>
        <AttestationDetailBox>
          <AttestationDetailBoxInner>
            <AttestationDetailSectionRow>
              <AttestationDetailSectionRowLabel>{i18n.reference}</AttestationDetailSectionRowLabel>
              <div className={cn(styles.ref, styles.value)}>{setElement.ref}</div>
            </AttestationDetailSectionRow>
            <AttestationDetailSectionRow>
              <AttestationDetailSectionRowLabel>{i18n.data}</AttestationDetailSectionRowLabel>
              <div className={cn(styles.data, styles.value)}>{elementData}</div>
            </AttestationDetailSectionRow>
            <AttestationDetailSectionRow>
              <AttestationDetailSectionRowLabel>{i18n.set_id}</AttestationDetailSectionRowLabel>
              <div className={cn(styles.setId, styles.value)}>{setElement.set_id}</div>
            </AttestationDetailSectionRow>
            <AttestationDetailSectionRow>
              <AttestationDetailSectionRowLabel>
                {i18n.element_index}
              </AttestationDetailSectionRowLabel>
              <div className={cn(styles.cm, styles.value)}>{setElement.element_idx}</div>
            </AttestationDetailSectionRow>
            <AttestationDetailSectionRow>
              <AttestationDetailSectionRowLabel>{i18n.status}</AttestationDetailSectionRowLabel>
              <div className={cn(styles.status, styles.value)}>{setElement.status}</div>
            </AttestationDetailSectionRow>
            <AttestationDetailSectionRow>
              <AttestationDetailSectionRowLabel>{i18n.on_chain}</AttestationDetailSectionRowLabel>
              <div className={cn(styles.onChain, styles.value)}>{i18n.not_available}</div>
            </AttestationDetailSectionRow>
            <AttestationDetailSectionRow>
              <AttestationDetailSectionRowLabel>{i18n.notarized}</AttestationDetailSectionRowLabel>
              <div className={cn(styles.notarized, styles.value)}>{i18n.not_available}</div>
            </AttestationDetailSectionRow>
          </AttestationDetailBoxInner>
        </AttestationDetailBox>
      </AttestationDetailSection>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default SetElementDetail;

export interface SetElementDetailProps {
  set_id: string;
  element_label: string;
}
