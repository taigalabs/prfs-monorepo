import React from "react";
import cn from "classnames";
import {
  prfsSign,
  type PrfsIdCredential,
  poseidon_2,
  makeECCredential,
} from "@taigalabs/prfs-crypto-js";
import { FaRegAddressCard } from "@react-icons/all-files/fa/FaRegAddressCard";

import styles from "./CommitmentData.module.scss";
import { i18nContext } from "@/i18n/context";
import { CommitmentType } from "@taigalabs/prfs-id-sdk-web";

export interface CommitmentData {
  account_id: string;
  public_key: string;
}

const CommitmentData: React.FC<CommitmentDataProps> = ({
  commitmentsMeta,
  credential,
  appId,
  // setSignInData,
}) => {
  const i18n = React.useContext(i18nContext);
  const [elems, setElems] = React.useState<React.ReactNode>(null);

  React.useEffect(() => {
    async function fn() {
      let el = [null];
      for (const cm of commitmentsMeta) {
        if (cm === CommitmentType.SIG_POSEIDON_1) {
          const sig = await prfsSign(credential.secret_key, appId);
          const sigBytes = sig.toCompactRawBytes();
          const sigHash = await poseidon_2(sigBytes);

          const { id, public_key } = await makeECCredential(sigHash);
          // setSignInData({
          //   account_id: id,
          //   public_key,
          // });

          // el.push(
          //   <li className={styles.item} key={d}>
          //     <div className={styles.img}>
          //       <FaRegAddressCard />
          //     </div>
          //     <div>
          //       <div className={styles.label}>{d}</div>
          //       <div className={cn(styles.value, styles.msg)}>
          //         <span>Generated using </span>
          //         <span>"{appId}"</span>
          //       </div>
          //       <div className={styles.value}>
          //         <span className={styles.label}>{i18n.id}: </span>
          //         <span>{id}</span>
          //       </div>
          //       <div className={styles.value}>
          //         <span className={styles.label}>{i18n.public_key}: </span>
          //         <span>{public_key}</span>
          //       </div>
          //     </div>
          //   </li>,
          // );
        }
      }
      setElems(el);
    }

    fn().then();
  }, [commitmentsMeta, setElems]);

  return (
    <>
      <ul className={styles.wrapper}>{elems}</ul>
    </>
  );
};

export default CommitmentData;

export interface CommitmentDataProps {
  commitmentsMeta: string[];
  credential: PrfsIdCredential;
  appId: string;
  // setCommitmentData:
  // setSignInData: React.Dispatch<React.SetStateAction<PrfsSignInData | null>>;
}
