import React from "react";
import cn from "classnames";
import { makeECCredential } from "@taigalabs/prfs-crypto-js";
import {
  AppSignInData,
  AppSignInQuery,
  AppSignInResult,
  PrfsIdCredential,
  makeAppSignInCm,
} from "@taigalabs/prfs-id-sdk-web";
import { FaRegAddressCard } from "@react-icons/all-files/fa/FaRegAddressCard";

import styles from "./SignInInputs.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  QueryItem,
  QueryItemLeftCol,
  QueryItemMeta,
  QueryItemRightCol,
} from "@/components/default_module/QueryItem";
import { ProofGenReceiptRaw } from "@/components/proof_gen/receipt";

const SignInInputs: React.FC<SignInInputsProps> = ({
  appSignInQuery,
  credential,
  appId,
  // setSignInData,
  setReceipt,
}) => {
  const i18n = React.useContext(i18nContext);
  const [elems, setElems] = React.useState<React.ReactNode>(null);

  React.useEffect(() => {
    async function fn() {
      const { appSignInData, name } = appSignInQuery;

      const el = [];
      for (const [idx, d] of appSignInData.entries()) {
        if (d === AppSignInData.ID_POSEIDON) {
          const { hashed } = await makeAppSignInCm(credential.secret_key, appId);
          const { id, public_key } = await makeECCredential(hashed);

          // setSignInData({
          //   account_id: id,
          //   public_key,
          // });

          const data: AppSignInResult = {
            account_id: id,
            public_key,
          };

          setReceipt(oldVal => ({
            ...oldVal,
            [name]: JSON.stringify(data),
          }));

          el.push(
            <QueryItem sidePadding key={idx}>
              <QueryItemMeta>
                <QueryItemLeftCol>
                  <FaRegAddressCard />
                </QueryItemLeftCol>
                <QueryItemRightCol>
                  <div className={styles.label}>{d}</div>
                  <div className={cn(styles.value, styles.msg)}>
                    <span>Generated using </span>
                    <span>{appId}</span>
                  </div>
                  <div className={styles.value}>
                    <span className={styles.label}>{i18n.id}: </span>
                    <span>{id}</span>
                  </div>
                  <div className={styles.value}>
                    <span className={styles.label}>{i18n.public_key}: </span>
                    <span>{public_key}</span>
                  </div>
                </QueryItemRightCol>
              </QueryItemMeta>
            </QueryItem>,
          );
        }
      }
      setElems(el);
    }

    fn().then();
  }, [appSignInQuery, setElems]);

  return (
    <>
      <ul className={styles.wrapper}>{elems}</ul>
    </>
  );
};

export default SignInInputs;

export interface SignInInputsProps {
  appSignInQuery: AppSignInQuery;
  credential: PrfsIdCredential;
  appId: string;
  // setSignInData: React.Dispatch<React.SetStateAction<AppSignInResult | null>>;
  setReceipt: React.Dispatch<React.SetStateAction<ProofGenReceiptRaw | null>>;
}
