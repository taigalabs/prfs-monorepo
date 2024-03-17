"use client";

import React from "react";
import cn from "classnames";
import { FaArrowLeft } from "@react-icons/all-files/fa/FaArrowLeft";
import ButtonCircleContainer from "@taigalabs/prfs-react-lib/src/button_circle_container/ButtonCircleContainer";
import { atstApi } from "@taigalabs/prfs-api-js";
import { i18nContext } from "@/i18n/context";
import { useQuery } from "@taigalabs/prfs-react-lib/react_query";
import Link from "next/link";

import styles from "./CryptoAssetSizeAtstDetail.module.scss";
import { paths } from "@/paths";
import {
  AttestationDetailBox,
  AttestationDetailBoxInner,
  AttestationDetailSection,
  AttestationDetailSectionRow,
  AttestationDetailSectionRowLabel,
  AttestationDetailTopMenuRow,
} from "@/components/attestation_detail/AttestationDetail";

const CryptoAssetSizeAtstDetail: React.FC<CryptoAssetSizeAtstDetailProps> = ({ atst_id }) => {
  const i18n = React.useContext(i18nContext);
  const { isLoading, data, error } = useQuery({
    queryKey: ["get_asset_size_atst"],
    queryFn: async () => {
      const { payload } = await atstApi({ type: "get_crypto_asset_size_atst", atst_id: atst_id });
      return payload;
    },
  });
  const atst = data?.prfs_crypto_asset_size_atst;
  const cryptoAssets = React.useMemo(() => {
    return atst && JSON.stringify(atst.meta);
  }, [atst?.meta]);
  const etherScanUrl = React.useMemo(() => {
    return atst && `https://etherscan.io/address/${atst.label.toLowerCase()}`;
  }, [atst?.label]);

  if (isLoading) {
    <div>Loading...</div>;
  }

  if (error) {
    <div>Fetch error: {error.toString()}</div>;
  }

  if (atst === undefined) {
    return <div>Loading...</div>;
  }

  return (
    atst && (
      <div className={styles.wrapper}>
        <AttestationDetailTopMenuRow>
          <Link href={paths.attestations__crypto_asset_size}>
            <ButtonCircleContainer>
              <FaArrowLeft />
            </ButtonCircleContainer>
          </Link>
        </AttestationDetailTopMenuRow>
        <div className={styles.avatarRow}>
          <div className={styles.rightCol}>
            <div className={styles.walletAddr}>{atst.label}</div>
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
                  <a href={etherScanUrl} target="_blank">
                    {etherScanUrl}
                  </a>
                </div>
              </AttestationDetailSectionRow>
              <AttestationDetailSectionRow>
                <AttestationDetailSectionRowLabel>
                  {i18n.crypto_assets}
                </AttestationDetailSectionRowLabel>
                <div className={cn(styles.destination, styles.value)}>{cryptoAssets}</div>
              </AttestationDetailSectionRow>
              <AttestationDetailSectionRow>
                <AttestationDetailSectionRowLabel>
                  {i18n.attestation_type}
                </AttestationDetailSectionRowLabel>
                <div className={cn(styles.attestationType, styles.value)}>{atst.atst_type}</div>
              </AttestationDetailSectionRow>
              <AttestationDetailSectionRow>
                <AttestationDetailSectionRowLabel>
                  {i18n.commitment}
                </AttestationDetailSectionRowLabel>
                <div className={cn(styles.cm, styles.value)}>{atst.cm}</div>
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

export default CryptoAssetSizeAtstDetail;

export interface CryptoAssetSizeAtstDetailProps {
  atst_id: string;
}
