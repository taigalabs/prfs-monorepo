"use client";

import React from "react";
import cn from "classnames";
import { FaArrowLeft } from "@react-icons/all-files/fa/FaArrowLeft";
import ButtonCircleContainer from "@taigalabs/prfs-react-components/src/button_circle_container/ButtonCircleContainer";
import { atstApi } from "@taigalabs/prfs-api-js";
import { i18nContext } from "@/i18n/context";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import styles from "./AccAtstDetail.module.scss";
import { paths } from "@/paths";

const AccAtstDetail: React.FC<AccAtstDetailProps> = ({ acc_atst_id }) => {
  const i18n = React.useContext(i18nContext);
  const { isLoading, data, error } = useQuery({
    queryKey: ["get_twitter_acc_atst"],
    queryFn: async () => {
      const { payload } = await atstApi("get_twitter_acc_atst", {
        acc_atst_id,
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
        <div className={styles.topMenuRow}>
          <Link href={paths.attestations__twitter}>
            <ButtonCircleContainer>
              <FaArrowLeft />
            </ButtonCircleContainer>
          </Link>
        </div>
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
        <div className={styles.metaRow}>
          <div className={styles.box}>
            <div className={styles.row}>
              <p className={styles.label}>{i18n.commitment}</p>
              <div className={cn(styles.commitment, styles.value)}>{atst.cm}</div>
            </div>
            <div className={styles.row}>
              <p className={styles.label}>{i18n.document_url}</p>
              <div className={cn(styles.url, styles.value)}>{atst.document_url}</div>
            </div>
            <div className={styles.row}>
              <p className={styles.label}>{i18n.destination}</p>
              <div className={cn(styles.destination, styles.value)}>{atst.dest}</div>
            </div>
            <div className={styles.row}>
              <p className={styles.label}>{i18n.attestation_type}</p>
              <div className={cn(styles.attestationType, styles.value)}>{atst.atst_type}</div>
            </div>
            <div className={styles.row}>
              <p className={styles.label}>{i18n.status}</p>
              <div className={cn(styles.status, styles.value)}>{atst.status}</div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default AccAtstDetail;

export interface AccAtstDetailProps {
  acc_atst_id: string;
}
