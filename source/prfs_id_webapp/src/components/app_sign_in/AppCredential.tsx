import React from "react";
import { useSearchParams } from "next/navigation";
import { PrfsIdCredential, AppSignInQuery, AppSignInResult } from "@taigalabs/prfs-id-sdk-web";
import { useMutation } from "@taigalabs/prfs-react-lib/react_query";
import { PrfsIdentitySignInRequest } from "@taigalabs/prfs-entities/bindings/PrfsIdentitySignInRequest";
import { PutPrfsIdSessionValueRequest } from "@taigalabs/prfs-entities/bindings/PutPrfsIdSessionValueRequest";
import { idApi, idSessionApi } from "@taigalabs/prfs-api-js";

import styles from "./AppCredential.module.scss";
import SignInInputs from "./SignInInputs";
import { ProofGenReceiptRaw } from "@/components/proof_gen/receipt";

enum AppCredentialStatus {
  Loading,
  Standby,
}

const AppCredential: React.FC<AppCredentialProps> = ({
  appId,
  appSignInQuery,
  credential,
  setReceipt,
}) => {
  const searchParams = useSearchParams();
  const [signInDataElem, setSignInDataElem] = React.useState<React.ReactNode>(null);

  React.useEffect(() => {
    async function fn() {
      try {
        const title = (
          <>
            <span className={styles.blueText}>{appId}</span> wants you to submit a few additional
            data to sign in
          </>
        );
        setTitle(title);

        if (appSignInQuery.appSignInData.length > 0) {
          const content = (
            <SignInInputs
              appSignInQuery={appSignInQuery}
              credential={credential}
              appId={appId}
              setSignInData={setSignInData}
              setReceipt={setReceipt}
            />
          );
          setSignInDataElem(content);
        }

        setAppCredentialStatus(AppCredentialStatus.Standby);
      } catch (err) {
        console.error(err);
      }
    }
    fn().then();
  }, [
    setAppCredentialStatus,
    searchParams,
    setTitle,
    setSignInData,
    setSignInDataElem,
    credential,
  ]);

  return <>{signInDataElem}</>;
};

export default AppCredential;

export interface AppCredentialProps {
  appId: string;
  credential: PrfsIdCredential;
  appSignInQuery: AppSignInQuery;
  setReceipt: React.Dispatch<React.SetStateAction<ProofGenReceiptRaw | null>>;
}
