import React from "react";
import {
  prfsSign,
  makeCredential,
  type PrfsIdCredential,
  poseidon,
  poseidon_2,
} from "@taigalabs/prfs-crypto-js";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import { useRouter, useSearchParams } from "next/navigation";
import {
  PrfsIdSignInSuccessPayload,
  sendMsgToOpener,
  SignInData,
  type PrfsIdSignInSuccessMsg,
  StoredCredential,
  persistPrfsIdCredential,
} from "@taigalabs/prfs-id-sdk-web";
import Spinner from "@taigalabs/prfs-react-components/src/spinner/Spinner";
import { encrypt } from "eciesjs";
import { useMutation } from "wagmi";
import { PrfsIdentitySignInRequest } from "@taigalabs/prfs-entities/bindings/PrfsIdentitySignInRequest";
import { idApi } from "@taigalabs/prfs-api-js";
import { FaRegAddressCard } from "@react-icons/all-files/fa/FaRegAddressCard";

import styles from "./SignInInputs.module.scss";
import { i18nContext } from "@/contexts/i18n";
import {
  PrfsIdSignInErrorMsg,
  PrfsIdSignInInnerPadding,
  PrfsIdSignInModuleBtnRow,
  PrfsIdSignInModuleHeader,
  PrfsIdSignInModuleInputArea,
  PrfsIdSignInModuleLogoArea,
  PrfsIdSignInModuleSubtitle,
  PrfsIdSignInModuleTitle,
  PrfsIdSignInWithPrfsId,
} from "@/components/prfs_id_sign_in_module/PrfsIdSignInModule";
import { IdCreateForm } from "@/functions/validate_id";
import { hexlify } from "ethers/lib/utils";

enum Step2Status {
  Loading,
  Standby,
}

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
          const id = sigHash.subarray(0, 20);
          const idHash = hexlify(id);

          el.push(
            <li className={styles.item} key={d}>
              <div className={styles.img}>
                <FaRegAddressCard />
              </div>
              <div>
                <p className={styles.label}>{d}</p>
                <p>{appId}</p>
                <p>{idHash}</p>
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
