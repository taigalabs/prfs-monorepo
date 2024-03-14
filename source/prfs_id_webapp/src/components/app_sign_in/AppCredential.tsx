import React from "react";
import { useSearchParams } from "next/navigation";
import { PrfsIdCredential, AppSignInQuery } from "@taigalabs/prfs-id-sdk-web";

import styles from "./AppCredential.module.scss";
import SignInInputs from "./SignInInputs";
import { ProofGenReceiptRaw } from "@/components/proof_gen/receipt";

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
        if (appSignInQuery.appSignInData.length > 0) {
          const content = (
            <SignInInputs
              appSignInQuery={appSignInQuery}
              credential={credential}
              appId={appId}
              setReceipt={setReceipt}
            />
          );
          setSignInDataElem(content);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fn().then();
  }, [searchParams, setSignInDataElem, credential]);

  return <>{signInDataElem}</>;
};

export default AppCredential;

export interface AppCredentialProps {
  appId: string;
  credential: PrfsIdCredential;
  appSignInQuery: AppSignInQuery;
  setReceipt: React.Dispatch<React.SetStateAction<ProofGenReceiptRaw | null>>;
}
