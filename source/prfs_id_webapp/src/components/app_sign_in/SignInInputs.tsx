import React from "react";
import cn from "classnames";
import { prfsSign, poseidon_2, makeECCredential } from "@taigalabs/prfs-crypto-js";
import { AppSignInData, PrfsIdCredential, makeAppSignCm } from "@taigalabs/prfs-id-sdk-web";
import { FaRegAddressCard } from "@react-icons/all-files/fa/FaRegAddressCard";

import styles from "./SignInInputs.module.scss";
import { i18nContext } from "@/i18n/context";

export interface PrfsSignInData {
  account_id: string;
  public_key: string;
}

const SignInInputs: React.FC<SignInInputsProps> = ({
  signInDataMeta,
  credential,
  appId,
  setSignInData,
}) => {
  const i18n = React.useContext(i18nContext);
  const [elems, setElems] = React.useState<React.ReactNode>(null);

  React.useEffect(() => {
    async function fn() {
      let el = [];
      for (const d of signInDataMeta) {
        if (d === AppSignInData.ID_POSEIDON) {
          const sigpos = await makeAppSignCm(credential.secret_key, appId);
          const { id, public_key } = await makeECCredential(sigpos);
          setSignInData({
            account_id: id,
            public_key,
          });

          el.push(
            <li className={styles.item} key={d}>
              <div className={styles.img}>
                <FaRegAddressCard />
              </div>
              <div>
                <div className={styles.label}>{d}</div>
                <div className={cn(styles.value, styles.msg)}>
                  <span>Generated using </span>
                  <span>"{appId}"</span>
                </div>
                <div className={styles.value}>
                  <span className={styles.label}>{i18n.id}: </span>
                  <span>{id}</span>
                </div>
                <div className={styles.value}>
                  <span className={styles.label}>{i18n.public_key}: </span>
                  <span>{public_key}</span>
                </div>
              </div>
            </li>,
          );
        }
      }
      setElems(el);
    }

    fn().then();
  }, [signInDataMeta, setElems]);

  return (
    <>
      <ul className={styles.wrapper}>{elems}</ul>
    </>
  );
};

export default SignInInputs;

export interface SignInInputsProps {
  signInDataMeta: string[];
  credential: PrfsIdCredential;
  appId: string;
  setSignInData: React.Dispatch<React.SetStateAction<PrfsSignInData | null>>;
}
