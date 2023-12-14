import React from "react";
import {
  prfsSign,
  type PrfsIdCredential,
  poseidon_2,
  makeECCredential,
} from "@taigalabs/prfs-crypto-js";
import { SignInData } from "@taigalabs/prfs-id-sdk-web";
import { FaRegAddressCard } from "@react-icons/all-files/fa/FaRegAddressCard";

import styles from "./SignInInputs.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { hexlify } from "ethers/lib/utils";

const SignInInputs: React.FC<SignInInputsProps> = ({
  signInData,
  credential,
  appId,
  setSignInData,
}) => {
  const [elems, setElems] = React.useState<React.ReactNode>(null);

  React.useEffect(() => {
    async function fn() {
      let el = [];
      for (const d of signInData) {
        if (d === SignInData.ID_POSEIDON) {
          const sig = await prfsSign(credential.secret_key, appId);
          const sigBytes = sig.toCompactRawBytes();
          const sigHash = await poseidon_2(sigBytes);

          const { id, public_key } = await makeECCredential(sigHash);

          el.push(
            <li className={styles.item} key={d}>
              <div className={styles.img}>
                <FaRegAddressCard />
              </div>
              <div>
                <p className={styles.label}>{d}</p>
                <p>{appId}</p>
                <p>{id}</p>
                <p>{public_key}</p>
              </div>
            </li>,
          );
        }
      }
      setElems(el);
    }

    fn().then();
  }, [signInData, setElems]);

  return (
    <>
      <ul className={styles.wrapper}>{elems}</ul>
    </>
  );
};

export default SignInInputs;

export interface SignInInputsProps {
  signInData: string[];
  credential: PrfsIdCredential;
  appId: string;
  setSignInData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}
